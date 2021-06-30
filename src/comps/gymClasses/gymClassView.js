// Firebase
import firebase from "../../context/firebaseContext"
import "firebase/auth"
import "firebase/firestore"

// React
import React, { Component } from 'react'

// Material UI
import
{ 	Grid, Typography, IconButton, Tooltip
} from '@material-ui/core';

import { ArrowBackIos, Add, Visibility, PersonAdd } from '@material-ui/icons';
import { withTheme } from '@material-ui/core/styles';

// WodTrackrr
import ClassInfo from "./classInfo"

import EditWod from "../wods/editWod"
import WodList from "../wods/wodList"
import ActionCancelModal from "../actionCancelModal"

import InviteAdminView from "./inviteAdminView"
import InviteMemberView from "./inviteMemberView"

import ClassAdminList from "../admins/classAdminList"
import ClassMemberList from "../members/classMemberList"

import AddWodClass from "../wods/addWodClass"

import BackButton  from "../backButton"

import { getWods, removeWod } from "../../utils/firestore/wods"
import { getClassAdmins } from "../../utils/firestore/classAdmin"
import { getClassMembers } from "../../utils/firestore/classMember"
import { getClassImage } from "../../utils/firestore/classImages"

import { isEmpty } from "../../utils/valid"
import "../../styles.css"



/*
	Given:
		userMD: props.userMD,
		boxID: props.boxID,
	Show:
		details of Box and its WODS, allows for removal of wods by owner
*/
const fs = firebase.firestore();
const DEFAULT_IMAGE_URL = "https://cdn.shopify.com/s/files/1/2416/1345/files/NCFIT_Logo_Shop_3x_5224365a-50f5-4079-b7cc-0f7ebeb4f470.png?height=628&pad_color=ffffff&v=1595625119&width=1200"

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
			showAddWod: false,
			classImageURL: DEFAULT_IMAGE_URL

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
					let gymClassMD = ss.data()
					this.setState({ gymClassMD: gymClassMD })
					this.getWodListener(gymClassMD)

				}
			})
		}
	}

	_getClassImage(){
		getClassImage(this.state.boxID, this.state.gymClassID)
		.then(url => {
			console.log(url)
			this.setState({classImageURL: url})
		})
		.catch(err => {
			console.log(err)
		})
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
				this.setState({userBoxes: boxes})
			})
		}
	}

	getAdminListener(){
		if(this.state.userMD.uid && !this.adminListener){
			this.adminListener =
			getClassAdmins(this.state.boxID, this.state.gymClassID)
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
			this.memberListener = getClassMembers(this.state.boxID, this.state.gymClassID)
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

	getWodListener(gymClassMD){
		if(!this.wodListener){
			this.wodListener = getWods(this.props.boxID, gymClassMD)
			.onSnapshot(ss => {
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
		this._getClassImage()
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
	 		{id:"btns", sortable:false, label:""}
	 	]
	 	let sortableHeadersUser = [
	 		{id:"date", sortable:true, label:"Date"},
	 		{id:"title", sortable:true, label:"Title"},
	 		{id:"btns", sortable:false, label:""}
	 	]

		return (
		 <Grid item xs={12}>

			<React.Fragment>
			{ isEmpty(this.state.userMD) || isEmpty(this.state.gymClassMD)
			?
				<React.Fragment>Loading</React.Fragment>
			:
			/*
				Sub pages
					Invite members, admins
					View members, admins


			*/
				this.state.gymClassMD.isPrivate && !this.isMember()
				?<Grid item xs={12} container>
					<Grid item xs={12} align="left">
						<BackButton />
					</Grid>
					<Grid item xs={12} align="center">
						<Typography variant='h5'>This is a Private Class</Typography>
					</Grid>
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
			/*
				Main Page


			*/
			<Grid item xs={12}>
				<BackButton />
				<Grid item align="center" xs={12}>
					<ClassInfo
						gymClassMD={this.state.gymClassMD}
						userMD={this.state.userMD}
						showEditBtn={this.isAdmin()} // TODO() check this
						url={this.state.classImageURL}
						onAlert={this.props.onAlert}
					/>
					<Grid item align="right" xs={12}>
						{ this.isMember() && this.state.gymClassMD.isPrivate?
							<React.Fragment>
								{!this.isOnlyMember() ?
									<Tooltip title="Invite member">
										<IconButton
											color="secondary" variant="outlined"
											onClick={ this.openMemberInvite.bind(this)}
										>
											<PersonAdd />
										</IconButton>
									</Tooltip>
								:
									<React.Fragment></React.Fragment>

								}
									<Tooltip title="View members">
										<IconButton
											color="secondary" variant="outlined"
											onClick={ this.openViewMembers.bind(this) }
										>
											<Visibility />
										</IconButton>
									</Tooltip>
							</React.Fragment>
						:
							<React.Fragment></React.Fragment>
						}
						{this.isAdmin()  && this.state.gymClassMD.isPrivate ?
							<React.Fragment>
								<Tooltip title="Invite admin">
									<IconButton
										color="primary" variant="outlined"
										onClick={ this.openAdminInvite.bind(this) }
									>
										<PersonAdd />
									</IconButton>
								</Tooltip>
								<Tooltip title="View admins">
									<IconButton
										color="primary" variant="outlined"
										onClick={ this.openViewAdmins.bind(this) }
									>
										<Visibility />
									</IconButton>
								</Tooltip>
							</React.Fragment>
						:
							<React.Fragment></React.Fragment>
						}
						{this.isAdmin() && this.state.gymClassMD?
							<Tooltip title="Add workout">
								<IconButton
									color="primary"
									onClick={this.toggleShowAddWod.bind(this)}>
										<Add />
								</IconButton>
							</Tooltip>
						:
							<React.Fragment></React.Fragment>
						}
					</Grid>
				</Grid>

				<WodList
					rows = {this.state.wods}
					filteredRows={this.state.wods}
					headers={this.isOwner()? sortableHeadersOwner: sortableHeadersUser}
					handleRemove={this.handleRemoveWod.bind(this)}
					handleEdit={this.handleEdit.bind(this)}
					showOwnerBtns={this.isAdmin()}
				/>

				<ActionCancelModal
					open={this.state.showRemoveAlert}
					onClose={this.handleModalClose.bind(this)}
					onAction={this.deleteWod.bind(this)}
					modalText={ `Remove ${this.state.curRemovewodInfo.title}?`}
					actionText={"Delete"}
					cancelText={"Cancel"}
				/>
				<EditWod
					open={this.state.showEditModal}
					onClose={this.handleEditModalClose.bind(this)}
					userBoxes={this.state.userBoxes}
					wodInfo={this.state.editWodInfo}
					onAlert={this.props.onAlert}
				/>
				<InviteAdminView
					userMD={this.state.userMD}
					gymClassMD={this.state.gymClassMD}
					onModalClose={this.onInviteModalClose.bind(this)}
					modalOpen={this.state.inviteModalOpen}
					onAlert={this.props.onAlert}
				/>
				<InviteMemberView
					userMD={this.state.userMD}
					gymClassMD={this.state.gymClassMD}
					onModalClose={this.onInviteMemberModalClose.bind(this)}
					modalOpen={this.state.inviteMemberModalOpen}
					onAlert={this.props.onAlert}
				/>
			</Grid>
		)
		}
	</React.Fragment>
	</Grid>)
  }
}

export default GymClassView = withTheme(GymClassView);

