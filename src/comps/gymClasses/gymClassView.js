// Firebase
import firebase from "../../context/firebaseContext"
import "firebase/auth"
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
	TableHead, TablePagination, TableRow, TableSortLabel, IconButton
} from '@material-ui/core';

import { ArrowBackIos } from '@material-ui/icons';


import SearchIcon from '@material-ui/icons/Search';
import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

// WodTrackrr

import EditWod from "../wods/editWod"
import SearchSortTable from "../searchSortTable"
import ActionCancelModal from "../actionCancelModal"

import InviteAdminView from "./inviteAdminView"
import InviteMemberView from "./inviteMemberView"

import ClassAdminList from "../admins/classAdminList"
import ClassMemberList from "../members/classMemberList"

import AddWodClass from "../wods/addWodClass"

import { getWods, removeWod } from "../../utils/firestore/wods"
import { getClassAdmins } from "../../utils/firestore/classAdmin"
import { getClassMembers } from "../../utils/firestore/classMember"

import "../../styles.css"



/*
	Given:
		userMD: props.userMD,
		boxID: props.boxID,
	Show:
		details of Box and its WODS, allows for removal of wods by owner
*/
const fs = firebase.firestore();

class GymClassView extends Component {
	constructor(props){
		super(props)
		this.state = {
			userMD: props.userMD,
			boxID: props.boxID,
			gymClassID: props.gymClassID,
			gymClassMD: {},
			gymClasses:[],
			userBoxes: [],
			hasBoxes: false,
			wods: [],
			currentWodID: "",
			currentWodMD: {},
			showRemoveAlert: false,
			showEditModal: false,
			editWodInfo: {},
			curRemovewodInfo: {},
			inviteModalOpen: false,
			inviteMemberModalOpen: false,
			admins: [],
			adminUids: [],
			members: [],
			memberUids: [],
			showAdminList:false,
			showMemberList: false,
			isAdmin: false,
			isMember: false,
			showAddWod: false

		}
	}

	getGymClassListener(){
		if(!this.gymClassListener){
			this.gymClassListener = fs.collection("gymClasses")
			.doc(this.state.boxID)
			.collection("classes")
			.doc(this.state.gymClassID)
			.onSnapshot(ss => {
				if(ss.exists){
					this.setState({gymClassMD: ss.data()})

				}
			})
		}
	}

	getUserBoxListener(){
		if(this.state.userMD.uid && !this.userBoxesListener ){
			this.userBoxesListener = fs.collection("boxes")
			.where("uid", "==", this.state.userMD.uid)
			.onSnapshot(ss => {
				let boxes = []
				if(!ss.empty){
					ss.forEach(doc => {
						boxes.push(doc.data())
					})
				}
				this.setState({userBoxes: boxes, hasBoxes: boxes.length? true: false})
			})
		}
	}

	getAdminListener(){
		if(this.state.userMD.uid && !this.adminListener){
			this.adminListener =
			getClassAdmins(this.state.gymClassID)
			.onSnapshot(ss => {
				let admins = []
				let adminUids = []
				if(!ss.empty){
					ss.docs.forEach(doc => {
						admins.push(doc.data())
						adminUids.push(doc.data().uid)
					})
					let isAdmin = adminUids.indexOf(this.state.userMD.uid) >= 0
					this.setState({admins: admins, adminUids: adminUids, isAdmin: isAdmin})
				}else{
					this.setState({admins: admins, adminUids: adminUids, isAdmin: false})
				}
			},
			err => {
				console.log(err)
			})
		}
	}

	getMemberListener(){
		if(this.state.userMD.uid && !this.memberListener){
			this.memberListener = getClassMembers(this.state.gymClassID)
			.onSnapshot(ss => {
				let members = []
				let memberUids = []
				if(!ss.empty){
					ss.docs.forEach(doc => {
						members.push(doc.data())
						memberUids.push(doc.data().uid)
					})
					let isMember = memberUids.indexOf(this.state.userMD.uid) >= 0
					this.setState({members: members, memberUids: memberUids, isMember: isMember})
				}else{
					this.setState({members: members, memberUids: memberUids, isMember: false})
				}
			},
			err => {
				console.log(err)
			})
		}
	}

	getWodListener(){
		console.log(`Getting wods for user: ${this.state.gymClassID}`)
		if(!this.wodListener){
			this.wodListener = getWods(this.state.gymClassID)
			.onSnapshot(ss => {
				console.log(ss)


				if(!ss.empty){
					let wods = []
					ss.forEach(doc => {
						wods.push(doc.data())
					})
					this.setState({
						wods: wods
					})
				}else{
					this.setState({
						wods: []
					})
				}
			}, err => {
				console.log(err)
				this.wodListener()
				this.wodListener = undefined
			})
		}

	}

	checkListeners(){
		if(!this.userBoxesListener)
			this.getUserBoxListener()
		if(!this.adminListener)
			this.getAdminListener()
		if(!this.memberListener)
			this.getMemberListener()


	}

	componentDidMount(){
		this.checkListeners()
		this.getGymClassListener()
		this.getWodListener()
	}

	static getDerivedStateFromProps(props, state){
		return state.userMD? state: props
	}

	componentDidUpdate(){
		this.checkListeners()
	}

	componentWillUnmount(){
		if(this.adminListener)
			this.adminListener()
		if(this.memberListener)
			this.memberListener()
		if(this.userBoxesListener)
			this.userBoxesListener()
		if(this.wodListener)
			this.wodListener()
		if(this.gymClassListener){
			this.gymClassListener()
		}
	}

	handleModalClose(){
	  	this.setState({showRemoveAlert:false})
	  }

	handleRemoveWod(wodInfo){
		this.setState({
			showRemoveAlert: true,
			curRemovewodInfo: wodInfo
		})
	}

	deleteWod(){
		this.setState({showRemoveAlert: false})

		removeWod(this.state.curRemovewodInfo)
		.then((res) => {
			this.props.onAlert({
				type: "success",
				message: "Deleted workout!"
			})
		})
		.catch(err => {
			this.props.onAlert({
				type: "error",
				message: err.message
			})
		})
	}



	onChange(ev){
		let val = ev.target.value
		let filteredWods = this.state.wods.filter(wod =>{
		  return wod["title"].toLowerCase().includes(val.toLowerCase())
		})
		this.setState({filteredWods: filteredWods})
	}

	handleEdit(info){
		if(!this.userBoxesListener)
			this.getUserBoxListener()
		this.setState({
			editWodInfo: info,
			showEditModal: true
		})
	}

	handleEditModalClose(){
		this.setState({showEditModal: false})
	}

	isOwner(){
		return this.state.gymClassMD["uid"] === this.state.userMD['uid']
	}

	openAdminInvite(){
		this.setState({inviteModalOpen: true})
	}

	openMemberInvite(){
		this.setState({inviteMemberModalOpen: true})
	}

	onInviteModalClose(){
		this.setState({inviteModalOpen: false})
	}

	onInviteMemberModalClose(){
		this.setState({inviteMemberModalOpen: false})
	}

	empty(obj){
		return (obj
		&& Object.keys(obj).length === 0
		&& obj.constructor === Object)
	}

	openViewAdmins(){
		this.setState({showAdminList: true})
	}

	openViewMembers(){
		this.setState({showMemberList: true})
	}

	closeDetailView(){
		this.setState({showAdminList: false,
			showMemberList: false,
			showAddWod: false
		})
	}

	isAdmin(){
		return (this.state.isAdmin || this.isOwner()) && this.state.userMD
	}

	isMember(){
		return (this.state.isMember || this.isAdmin()) && this.state.userMD
	}
	 isOnlyMember(){
		 return this.state.isMember && this.state.userMD && !this.isAdmin()
	 }


	 toggleShowAddWod(){
		 this.setState({showAddWod: true})
	 }

  	render(){
	 	let sortableHeadersOwner = [
	 		{id:"date", sortable:true, label:"Date"},
	 		{id:"title", sortable:true, label:"Title"},
			{id:"title2", sortable:true, label:""},
	 		{id:"btns", sortable:false, label:""}
	 	]
	 	let sortableHeadersUser = [
	 		{id:"date", sortable:true, label:"Date"},
	 		{id:"title", sortable:true, label:"Title"},
			{id:"title2", sortable:true, label:""},
	 		{id:"btns", sortable:false, label:""}
	 	]
		 let viewMemberBtnSize = this.isOnlyMember()? 12: 6

		return this.empty(this.state.userMD) || this.empty(this.state.gymClassMD)
			?
				<React.Fragment>Loading</React.Fragment>
			:
		 		this.state.gymClassMD.isPrivate && !this.isMember()
				?<Grid item xs={12} align="center">
					<Paper elevation={6}>
						<Typography>This is a Private Class</Typography>
					</Paper>
				</Grid>
				:
				this.state.showAdminList && this.isAdmin() ?
		 			<Grid item xs={12}>
						<Grid item xs={12}>
							<IconButton onClick={this.closeDetailView.bind(this)}
								style={{color: this.props.theme.palette.text.primary}}>
								<ArrowBackIos />
							</IconButton>
						</Grid>
						<Grid item xs={12}>
							<ClassAdminList
								gymClassID={this.state.gymClassID}
								filteredAdmins={this.state.admins}
								admins={this.state.admins}
								isOwner={this.isAdmin()}
								onAlert={this.props.onAlert}
							/>
						</Grid>
					 </Grid>
				:
				this.state.showMemberList && this.isMember()?
		 			<Grid item xs={12}>
						<Grid item xs={12}>
							<IconButton onClick={this.closeDetailView.bind(this)}
								style={{color: this.props.theme.palette.text.primary}}>
								 <ArrowBackIos />
							</IconButton>
						</Grid>
						<Grid item xs={12}>
						<ClassMemberList
							gymClassID={this.state.gymClassID}
							filteredMembers={this.state.members}
							members={this.state.members}
							isOwner={this.isAdmin()}
							onAlert={this.props.onAlert}
						/>
						</Grid>
					</Grid>
				:
				this.state.showAddWod?
					<Grid item xs={12}>
						<Grid item xs={12}>
							<IconButton onClick={this.closeDetailView.bind(this)}
								style={{color: this.props.theme.palette.text.primary}}>
								 <ArrowBackIos />
							</IconButton>
						</Grid>
						<Grid item xs={12}>
							<AddWodClass
							gymClassMD={this.state.gymClassMD}
							onAlert={this.props.onAlert}
							/>
						</Grid>
					</Grid>
				:
			(
			<Grid item xs={12}>

				<Grid item align="center" xs={12}>
					<Paper elevation={6}>
						<Typography align="center" variant="h3">
							{this.state.gymClassMD['title']}
						</Typography>
						<Typography align="center" variant="h6">
							{this.state.gymClassMD['boxTitle']}
						</Typography>
					</Paper>
				</Grid>


				<Grid item container spacing={1} xs={12}
					style={{marginTop: "16px"}}>
					{this.isAdmin()?
						<React.Fragment>
							<Grid item xs={6}>
								<Button color="primary" variant="outlined" style={{width: "100%"}}
									onClick={ this.openAdminInvite.bind(this) }>
									Invite Admin
								</Button>
							</Grid>
							<Grid item xs={6}>
								<Button color="primary" variant="outlined" style={{width: "100%"}}
									onClick={ this.openViewAdmins.bind(this) }>
									View Admins
								</Button>
							</Grid>
								<InviteAdminView
									userMD={this.state.userMD}
									gymClassMD={this.state.gymClassMD}
									onModalClose={this.onInviteModalClose.bind(this)}
									modalOpen={this.state.inviteModalOpen}
									onAlert={this.props.onAlert}
								/>
						</React.Fragment>

					:
						<React.Fragment></React.Fragment>
					}

					{ this.isMember() ?
						<React.Fragment>
							{!this.isOnlyMember()?

								<Grid item xs={6}>
								<Button color="secondary" variant="outlined" style={{width: "100%"}}
											onClick={ this.openMemberInvite.bind(this) }>
											Invite Member
										</Button>
								</Grid>
							:
								<React.Fragment></React.Fragment>

							}
								<Grid item xs={viewMemberBtnSize}>
									<Button color="secondary" variant="outlined" style={{width: "100%"}}
										onClick={ this.openViewMembers.bind(this) }>
										View Members
									</Button>
								</Grid>
							<InviteMemberView
									userMD={this.state.userMD}
									gymClassMD={this.state.gymClassMD}
									onModalClose={this.onInviteMemberModalClose.bind(this)}
									modalOpen={this.state.inviteMemberModalOpen}
									onAlert={this.props.onAlert}
								/>
						</React.Fragment>
					:
						<React.Fragment></React.Fragment>
					}

					{this.isAdmin() && this.state.gymClassMD?
						<Button
						 color="primary"
						 variant="outlined"
						 fullWidth
						 onClick={this.toggleShowAddWod.bind(this)}>
							Add Workout
						</Button>
					:
						<React.Fragment></React.Fragment>
					}
				</Grid>
				<Paper elevation={6} style={{padding: "8px"}}>
					<SearchSortTable
						rows = {this.state.wods}
						filteredRows={this.state.wods}
						headers={this.isOwner()? sortableHeadersOwner: sortableHeadersUser}
						handleRemove={this.handleRemoveWod.bind(this)}
						handleEdit={this.handleEdit.bind(this)}
						showOwnerBtns={this.isAdmin()}
					/>
				</Paper>

				<ActionCancelModal
					open={this.state.showRemoveAlert}
					onClose={this.handleModalClose.bind(this)}
					onAction={this.deleteWod.bind(this)}
					modalText={ `Remove ${this.state.curRemoveWodTitle} (${this.state.curRemoveWodID})?`}
					actionText={"Delete"}
					cancelText={"Cancel"}
				/>

				<EditWod
					open={this.state.showEditModal}
					onClose={this.handleEditModalClose.bind(this)}
					userBoxes={this.state.userBoxes}
					hasBoxes={this.state.hasBoxes}
					wodInfo={this.state.editWodInfo}
					onAlert={this.props.onAlert}
			/>
			</Grid>
		)
  }
}

export default GymClassView = withTheme(GymClassView);

