// Firebase
import firebase from "../../context/firebaseContext"
import "firebase/firestore"

// React
import React, { Component } from 'react'

// Material UI
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import 
{ 	Grid, Paper, Button, Typography, Collapse, TextField, Select,
	Accordion, AccordionSummary, AccordionDetails, FormControlLabel,
	CircularProgress, LinearProgress, CardActions, Card, CardContent,
	Modal, InputAdornment, TableBody, Table, TableContainer,
	TableHead, TablePagination, TableRow, TableSortLabel
} from '@material-ui/core';
import {TableCell as TC} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';
import { Alert } from '@material-ui/lab';
import { withTheme, withStyles } from '@material-ui/core/styles';

import { getUserClassMembers } from "../../utils/firestore/classMember"

import "../../styles.css"
import { Redirect } from "react-router";

/*
	Given:
		userMD: props.userMD,
		boxID: props.boxID,
	Show:
		details of Box and its WODS, allows for removal of wods by owner
*/
const fs = firebase.firestore();

const TableCell = withStyles({root:{
	borderBottom: "none"
}})(TC)


function MemberRowRaw(props){
    let gymClassTitle = props.info.gymClassTitle
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
const MemberRow = withTheme(MemberRowRaw)

class ClassMemberView extends Component {
	constructor(props){
		super(props)
		this.state = {
            userMD: props.userMD,
            classes: [],
            redirect: false, 
            redirectUrl: ""
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

    componentWillUnmount(){
        if(this.userClassMembersListener)
            this.userClassMembersListener()
    }


    getListener(){
        if(this.state.userMD && !this.userClassMembersListener){
            this.userClassMembersListener = getUserClassMembers(this.state.userMD.uid)
            .onSnapshot(ss => {
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
            })
        }
    }

    onView(redirectUrl){
        this.setState({redirect: true, redirectUrl: redirectUrl})
    }

  render(){
		return( 
            <React.Fragment>
                {this.state.redirect?
                    <Redirect key={"redirectClassMemberView"} to={this.state.redirectUrl}/>
                :
                    <React.Fragment></React.Fragment>
                }
                {this.state.classes.length > 0?
                    <Grid item xs={12} style={{margin: "16px 0px 0px 0px"}}>
                        <Paper elevation={6}>
                            <Typography variant="subtitle1">Membership</Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Gym</TableCell>
                                        <TableCell align="center">Class</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.classes.map((classMember, i) => {
                                        return (
                                            <MemberRow key={i}
                                                info={classMember} 
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

export default ClassMemberView = withTheme(ClassMemberView)