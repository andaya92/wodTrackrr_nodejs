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
	Modal, InputAdornment, TableBody, Table, TableCell, TableContainer,
	TableHead, TablePagination, TableRow, TableSortLabel
} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';
import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import { sendMemberInvite } from "../../utils/firestore/classMember"
import InviteView from "./inviteView"

import "../../styles.css"

/*
	Given:
		userMD: props.userMD,
		boxID: props.boxID,
	Show:
		details of Box and its WODS, allows for removal of wods by owner
*/
const fs = firebase.firestore();

class InviteMemberView extends Component {
	constructor(props){
		super(props)
		this.state = {
            userMD: props.userMD,
            gymClassMD: props.gymClassMD,
			allUsers: [],
            filteredUsers: [],
            selectedUser: {}
		}
	}

	componentDidMount(){
        fs.collection("users")
        .onSnapshot(ss => {
            let users = []
            if(!ss.empty){
                ss.forEach(doc => {
                    users.push(doc.data())
                })
                users.sort((a, b) => {
                    return (a.username > b.username)? 1 : -1
                })
                this.setState({allUsers: users,
                    filteredUsers: users,
                    selectedUser: users[0]
                })
            }else{
                this.setState({allUsers: users,
                    filteredUsers: users,
                    selectedUser: {}
                })
            }
        })
	}

	static getDerivedStateFromProps(props, state){
		return props
	}

	onKeyUp(data){
		if((data.keyCode || data.which) == 13){

		}
	}

	onChange(ev){
		/*
			Search bar, filter by name
		*/
		let val = ev.target.value
		let filteredUsers = this.state.allUsers.filter(user =>{
		  return user["username"].toLowerCase().includes(val.toLowerCase())
		})
		this.setState({filteredUsers: filteredUsers, selectedUser: filteredUsers[0]})
	}

    sendInvite(){
        if(!this.state.selectedUser)
            return

        let data = {
            msg: "Accept invite?",
            gymClassID: this.state.gymClassMD.gymClassID,
            senderUID: this.state.userMD.uid,
            senderUsername: this.state.userMD.username,
            gymClassTitle: this.state.gymClassMD.title,
            boxTitle: this.state.gymClassMD.boxTitle,
            boxID: this.state.gymClassMD.boxID,
            uid: this.state.selectedUser.uid,
            date: Date.now()
        }
        this.props.onModalClose()
        console.log(`Send invite to ${this.state.selectedUser.uid} from ${this.state.userMD.uid}`)

        sendMemberInvite(this.state.selectedUser.uid, data)
        .then((res) => {
            this.props.onAlert({
				type: "success",
				message: res
			})
        })
        .catch(err => {
            this.props.onAlert({
				type: "error",
				message: err.message
			})
        })
    }

    onSelectChange(ev){
        let user = JSON.parse(ev.target.value)
        console.log(user)
        this.setState({selectedUser: user})
    }

  render(){
		return(
            <InviteView
            modalOpen={this.state.open}
            title="Invite Member"
            onChange={this.onChange.bind(this)}
            onSelectChange={this.onSelectChange.bind(this)}
            onModalClose={this.props.onModalClose}
            sendInvite={this.sendInvite.bind(this)}
            filteredUsers={this.state.filteredUsers}
            modalOpen={this.props.modalOpen}
        />
    )}
}

export default InviteMemberView = withTheme(InviteMemberView)