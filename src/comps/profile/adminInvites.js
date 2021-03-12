// Firebase
import firebase from "../../context/firebaseContext"
import "firebase/firestore"

// React
import React, { Component } from 'react'

// Material UI
import { Check, Close } from '@material-ui/icons'
import
{ 	Grid, Paper, Button, Typography, IconButton, TextField, Select,
	Accordion, AccordionSummary, AccordionDetails, FormControlLabel,
	CircularProgress, LinearProgress, CardActions, Card, CardContent,
	Modal, InputAdornment, TableBody, Table, TableCell, TableContainer,
	TableHead, TablePagination, TableRow, TableSortLabel
} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';
import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import { setClassAdmin, getUserAdminInvites, removeNotification } from "../../utils/firestore/classAdmin"

import "../../styles.css"

const fs = firebase.firestore();


function NotificationRaw(props){
    let senderUsername = props.info.senderUsername
    let adminInviteID = props.info.adminInviteID
    let gymClassTitle = props.info.gymClassTitle
    let gymClassBoxTitle = props.info.boxTitle

    return(
        <Grid container item xs={12}>
            <Grid item xs={8}>
                <Typography variant="caption">
                {senderUsername} wants you to be an Admin of {gymClassTitle} at {gymClassBoxTitle}
                </Typography>
            </Grid>
            <Grid item xs={2}>
                <IconButton size="small" onClick={() => { props.acceptInvite(props.info) }} color="secondary">
                    <Check />
                </IconButton>
            </Grid>
            <Grid item xs={2}>
                <IconButton size="small" onClick={() => { props.removeNotification(props.info) }} >
                    <Close color="error"/>
                </IconButton>
            </Grid>
        </Grid>
    )
}
const Notification = withTheme(NotificationRaw)



class AdminInvites extends Component {
	constructor(props){
		super(props)
		this.state = {
            userMD: props.userMD,
            notifications: []
		}
	}

	componentDidMount(){
        this.getListener()
	}

    componentWillUnmount(){
        if(this.notificationsListener)
            this.notificationsListener()
    }

	static getDerivedStateFromProps(props, state){
		return props
	}

    componentDidUpdate(){
        this.getListener()
    }

    getListener(){
        if(this.state.userMD && !this.notificationsListener){
            this.notificationsListener = getUserAdminInvites(this.state.userMD.uid)
            .onSnapshot(ss => {
                let notifications = []

                if(!ss.empty){
                    ss.docs.forEach(doc => {
                        notifications.push(doc.data())
                    })

                    notifications.sort((a, b) => {
                        return (a.date > b.date)? 1 : -1
                    })
                    this.setState({ notifications: notifications })
                }else{
                    this.setState({ notifications: notifications })
                }
            },
            err => {
                console.log(err)
            })
        }
    }

    onRemoveNotification(notify){
        removeNotification(notify)
        .then( res => { console.log(res) })
        .catch( err => { console.log(err) })
    }

    acceptInvite(notify){
        console.log(notify)
        let boxID = notify.boxID
        let gymClassID = notify.gymClassID
        let classTitle = notify.gymClassTitle
        let boxTitle = notify.boxTitle
        let owner = notify.owner


        setClassAdmin(
            this.state.userMD.uid,
            boxID,
            gymClassID,
            owner,
            this.state.userMD.username,
            boxTitle,
            classTitle
        )
        .then(res => {
            console.log(res)
            this.onRemoveNotification(notify)
        })
        .catch(err => {
            console.log(err)
        })


    }

  render(){
		return(
            <Grid item xs={12}>
            {this.state.notifications.length > 0?
                <Paper style={{margin: "16px 0px 0px 0px "}}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2">
                            Admin Notifications
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                    {this.state.notifications.map((notify, i) => {
                        return (
                            <Notification key={i}
                                info={notify}
                                removeNotification={this.onRemoveNotification.bind(this)}
                                acceptInvite={this.acceptInvite.bind(this)}
                            />)
                    })}
                    </Grid>
                </Paper>
            :
                <React.Fragment></React.Fragment>
            }
            </Grid>
    )}
}

export default AdminInvites = withTheme(AdminInvites)