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

        console.log(`Send invite to ${this.state.selectedUser.uid} from ${this.state.userMD.uid}`)

        sendMemberInvite(this.state.selectedUser.uid, data)
        .then((res) => {
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        })
    }

    onSelectChange(ev){
        let user = JSON.parse(ev.target.value)
        console.log(user)
        this.setState({selectedUser: user})
    }

  render(){
		return( 
		<Grid item xs={12}>
			<Modal
                open={this.props.modalOpen}
                onClose={this.props.onModalClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description">
                <div style={{
                    position: 'absolute',
                    top: "50%",
                    left: "50%",
                    width: "80vw",
                    transform: "translate(-50%, -50%)",
                }}>
                    <Grid item align="center" xs={12}>
                    <Paper style={{height:"25vh", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <Paper elevation={2} style={{padding: "8px"}} component="form">
                        <Paper elevation={6}>
                        <Typography variant="h6">Invite Member</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            onKeyUp={this.onKeyUp.bind(this)}
                            onChange={this.onChange.bind(this)}
                            placeholder="Search Users"
                            style={{margin: "0px 0px 8px 0px"}}
                            InputProps={{
                                endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon color="primary" />
                                </InputAdornment>
                                )
                            }}
                        />
                        </Paper>
                        
                        <Paper elevation={6}>
                            <Select native style={{
                                    width: "100%",
                                    margin: "0px 0px 8px 0px",
                                    padding: "4px"
                                }}
                                color="primary"
                                onChange={this.onSelectChange.bind(this)}>
                                {this.state.filteredUsers ?
                                    this.state.filteredUsers.map((user, i) => {
                                        return (<option key={i} 
                                                        value={JSON.stringify(user)} >
                                                        {user["username"]}
                                                </option>)
                                    })
                                :
                                    <option aria-label="None" value="" >No users!</option>
                                }
                            </Select>
                        </Paper>
                        <Paper elevation={6}>
                            <Button 
                                color="primary"
                                variant="outlined"
                                size="small"
                                onClick={this.sendInvite.bind(this)}>
                                Invite
                            </Button>
                            <Button 
                                variant="outlined" 
                                size="small"
                                onClick={this.props.onModalClose}>
                                Cancel
                            </Button>
                        </Paper>
                    </Paper>
                    </Paper>
                    </Grid>
                </div>
            </Modal>
		</Grid>
    )}
}

export default InviteMemberView = withTheme(InviteMemberView)