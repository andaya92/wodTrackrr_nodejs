// Firebase
import firebase from "../../context/firebaseContext"
import "firebase/firestore"

// React
import React, { Component } from 'react'
import { Redirect } from "react-router";
import { withRouter } from "react-router-dom";

// Material UI
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import
{ 	Grid, Paper, Typography, Modal, TableBody, Table, TableContainer,
	TableHead, TableRow
} from '@material-ui/core';

import {TableCell as TC} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';
import { Alert } from '@material-ui/lab';
import { withTheme, withStyles } from '@material-ui/core/styles';

import { getUserClassAdmins } from "../../utils/firestore/classAdmin"

import "../../styles.css"

const fs = firebase.firestore();

const TableCell = withStyles({root:{
	borderBottom: "none"
}})(TC)


function AdminRowRaw(props){
    let gymClassTitle = props.info.classTitle
    let boxTitle = props.info.boxTitle
    let boxID = props.info.boxID
    let redirectUrl = `class/${boxID}/${props.info.gymClassID}`

    return(
        <TableRow onClick={ (ev) => props.onView(redirectUrl)}>
            <TableCell>
                <Typography color="primary">
                    {boxTitle}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography color="primary">
                    {gymClassTitle}
                </Typography>
            </TableCell>
        </TableRow>
    )
}
const AdminRow = withTheme(AdminRowRaw)

class ClassAdminView extends Component {
	constructor(props){
		super(props)
		this.state = {
            userMD: props.userMD,
            classes: []
		}
	}

	componentDidMount(){
        this.getListener()
	}

	static getDerivedStateFromProps(props, state){
		return props
	}

    componentDidUpdate(){
        this.getListener()
    }

    getListener(){
        if(this.state.userMD.uid && !this.userClassAdminsListener){
            this.userClassAdminsListener = getUserClassAdmins(this.state.userMD.uid)
            .onSnapshot(ss => {
                console.log(ss)
                let classes = []
                if(!ss.empty){
                    ss.forEach(doc => {
                        classes.push(doc.data())
                    })
                    classes.sort((a, b) => {
                        return (a.date > b.date)? 1 : -1
                    })
                    this.setState({ classes: classes })
                }else{
                    this.setState({ classes: classes })
                }
            },
            err => {
                console.log(err)
            })
        }
    }

    componentWillUnmount(){
        if(this.userClassAdminsListener)
        this.userClassAdminsListener()
    }

    onView(redirectUrl){
        this.props.history.push(redirectUrl)
    }

  render(){
		return(
            <React.Fragment>
                {this.state.classes.length > 0?
                    <Grid item xs={12} style={{margin: "16px 0px 0px 0px"}}>
                        <Paper elevation={6}>
                            <Typography variant="subtitle1">Admin Roles</Typography>
                            <hr/>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Gym</TableCell>
                                        <TableCell align="left">Class</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.classes.map((classAdmin, i) => {
                                        return (
                                            <AdminRow key={i}
                                                info={classAdmin}
                                                onView={this.onView.bind(this)}
                                            />)
                                    })}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                :
                    <React.Fragment></React.Fragment>
                }
            </React.Fragment>
    )}
}

export default ClassAdminView = withRouter(withTheme(ClassAdminView))