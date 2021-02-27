// Firebase
import firebase from "../../context/firebaseContext"
import "firebase/firestore"

// React
import React, { Component } from 'react'

// Material UI
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import 
{ 	Grid, Paper, Button, Typography, IconButton, TextField, Select,
	Accordion, AccordionSummary, AccordionDetails, FormControlLabel,
	CircularProgress, LinearProgress, CardActions, Card, CardContent,
	Modal, InputAdornment, TableBody, Table, TableCell, TableContainer,
	TableHead, TablePagination, TableRow, TableSortLabel
} from '@material-ui/core';
import { Check, Close } from '@material-ui/icons'


import SearchIcon from '@material-ui/icons/Search';
import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import { setClassMember, getUserMemberInvites, removeNotification } from "../../utils/firestore/classMember"

import "../../styles.css"

/*
	Given:
		userMD: props.userMD,
		boxID: props.boxID,
	Show:
		details of Box and its WODS, allows for removal of wods by owner
*/
const fs = firebase.firestore();


function NotificationRaw(props){
    let senderUsername = props.info.senderUsername
    let memberInviteID = props.info.memberInviteID
    let gymClassTitle = props.info.gymClassTitle
    let gymClassBoxTitle = props.info.boxTitle

    return(
        <Grid container item xs={12}>
            <Grid item xs={8}>
                <Typography variant="caption">
                {senderUsername} wants you to be a Member of {gymClassTitle} at {gymClassBoxTitle}
                </Typography>
            </Grid>
            <Grid item xs={2}>
               <IconButton size="small" onClick={() => { props.acceptInvite(props.info) }} color="secondary">
                    <Check />
                </IconButton>
            </Grid>
            <Grid item xs={2}>
                <IconButton size="small" onClick={() => { props.removeNotification(memberInviteID) }} >
                    <Close color="error"/>
                </IconButton>
            </Grid>
        </Grid>
    )
}
const Notification = withTheme(NotificationRaw)

class MemberInvites extends Component {
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
        if(this.state.userMD.uid && !this.notificationsListener){
            this.notificationsListener = getUserMemberInvites(this.state.userMD.uid)
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
            })
        }
    }

    onRemoveNotification(notifyID){
        removeNotification(notifyID)
        .then( res => { console.log(res) })
        .catch( err => { console.log(err) })
    }

    acceptInvite(notify){
        let gymClassID = notify.gymClassID
        let classTitle = notify.gymClassTitle
        let boxTitle = notify.boxTitle
        let boxID = notify.boxID
        
        let data = {            
            gymClassID: gymClassID,
            gymClassTitle: classTitle,
            boxTitle: boxTitle,
            uid: this.state.userMD.uid,
            boxID: boxID,
            username: this.state.userMD.username,
            date: Date.now()
        }

        setClassMember(this.state.userMD.uid, gymClassID, data)
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        })
       
        // this.removeNotification(notify.notifyID)

    }

  render(){
		return( 
            <Grid item xs={12}>
            {this.state.notifications.length > 0?
                <Paper style={{margin: "16px 0px 0px 0px "}}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2">
                            Member Notifications
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

export default MemberInvites = withTheme(MemberInvites)