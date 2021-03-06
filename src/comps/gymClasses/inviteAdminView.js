// Firebase
import firebase from "../../context/firebaseContext"
import "firebase/firestore"

// React
import React, { Component } from 'react'

import { withTheme } from '@material-ui/core/styles';

import { sendAdminInvite } from "../../utils/firestore/classAdmin"
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

class InviteAdminView extends Component {
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
        this.listener = fs.collection("users")
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

    componentWillUnmount(){
        if(this.listener)
            this.listener()
    }

	onChange(ev){
        let val = ev.target.value
        console.log(val)
		let filteredUsers = this.state.allUsers.filter(user =>{
		  return user["username"].toLowerCase().includes(val.toLowerCase())
		})
		this.setState({filteredUsers: filteredUsers, selectedUser: filteredUsers[0]})
	}

    sendInvite(){
        if(!this.state.selectedUser)
            return

        console.log(`Send invite to ${this.state.selectedUser.uid} from ${this.state.userMD.uid}`)


        this.props.onModalClose()
        console.log("Sending data",
            this.state.selectedUser.uid,
            this.state.gymClassMD,
            this.state.userMD.uid,
            this.state.userMD.username)

        sendAdminInvite(
            this.state.selectedUser.uid,
            this.state.gymClassMD,
            this.state.userMD.uid,
            this.state.userMD.username
        )
        .then((res) => {
            this.props.onAlert({
				type: "success",
				message: String(res)
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
        this.setState({selectedUser: user})
    }

  render(){
		return(

            <InviteView
                title="Invite Admin"
                onChange={this.onChange.bind(this)}
                onSelectChange={this.onSelectChange.bind(this)}
                onModalClose={this.props.onModalClose}
                sendInvite={this.sendInvite.bind(this)}
                filteredUsers={this.state.filteredUsers}
                modalOpen={this.props.modalOpen}
            />
    )}
}

export default InviteAdminView = withTheme(InviteAdminView)