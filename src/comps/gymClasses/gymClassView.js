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

// WodTrackrr
import ScoreView from "../scores/scoreView"
import GymClassList from "../gymClasses/gymClassList"
import EditWod from "../wods/editWod"
import { removeWod } from "../../utils/firestore/wods"
import SearchSortTable from "../searchSortTable"
import ActionCancelModal from "../actionCancelModal"
import "../../styles.css"



/*
	Given:
		userMD: props.userMD,
		boxID: props.boxID,
	Show:
		details of Box and its WODS, allows for removal of wods by owner
*/
const fs = firebase.firestore();

class BoxView extends Component {
	constructor(props){
		super(props)
		console.log(props)
		this.state = {
			userMD: props.userMD,
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
			curRemoveWodBoxID: "",
			curRemoveWodID: "",
			curRemoveWodTitle: ""
		}
	}

	getGymClassListener(){
		fs.collection("gymClasses").doc(this.state.gymClassID)
		.onSnapshot(ss => {
			if(ss.exists){
				this.setState({gymClassMD: ss.data()})

			}
		})
	}

	getUserBoxListener(){
		if(this.state.userMD.uid ){
			this.userBoxesListener = fs.collection("boxes")
			.where("uid", "==", this.state.userMD.uid)
			.onSnapshot(ss => {
				let boxes = []
				console.log(ss)
				if(!ss.empty){
					ss.forEach(doc => {
						console.log(doc.data())
						boxes.push(doc.data())
					})
				}
				this.setState({userBoxes: boxes, hasBoxes: boxes.length? true: false})
			})
		}
	}

	

	getWodListener(){
		this.wodListener = fs.collection("wods")
		.where("gymClassID", "==", this.state.gymClassID)
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
		}, err => { console.log(err)})
	}

	checkListeners(){
		if(this.userBoxesListener === undefined)
			this.getUserBoxListener()
		if(this.wodListener === undefined)
			this.getWodListener()
	}

	componentDidMount(){
		this.checkListeners()
		this.getGymClassListener()
	}

	componentWillReceiveProps(newProps){
		console.log(newProps)
		this.setState({...newProps})
		this.checkListeners()
	}

	componentWillUnmount(){
		if(this.wodListener)
			this.wodListener()
		if(this.boxListener)
			this.boxListener()
		if(this.userBoxesListener)
			this.userBoxesListener()
	}

	handleModalClose(){
	  	this.setState({showRemoveAlert:false})
	  }

	handleRemoveWod(wodInfo){
		this.setState({
			showRemoveAlert: true,
			curRemoveWodBoxID: wodInfo["boxID"],
			curRemoveWodID: wodInfo["wodID"],
			curRemoveWodTitle: wodInfo["title"],
		})
	}

	deleteWod(){
		removeWod(this.state.curRemoveWodID)
		.then((res) => {
			console.log(res)
			this.setState({showRemoveAlert: false})
		})
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
		let filteredWods = this.state.wods.filter(wod =>{
		  return wod["title"].toLowerCase().includes(val.toLowerCase())
		})
		this.setState({filteredWods: filteredWods})
	}

	handleEdit(info){
		console.log("Populate with info, show in modal with form")
		console.log(info)
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
  render(){
  	

	 	let sortableHeadersOwner = [
	 		{id:"date", sortable:true, label:"Date"},
	 		{id:"title", sortable:true, label:"Title"},
	 		{id:"scoreType", sortable:true, label:"Scoring"},
	 		{id:"wodText", sortable:false, label:"Wod"},
	 		{id:"btns", sortable:false, label:""}
	 	]
	 	let sortableHeadersUser = [
	 		{id:"date", sortable:true, label:"Date"},
	 		{id:"title", sortable:true, label:"Title"},
	 		{id:"scoreType", sortable:true, label:"Scoring"},
	 		{id:"wodText", sortable:false, label:"Wod"},
	 		{id:"btns", sortable:false, label:""}
	 	]
	 
		return !this.state.userMD?  <React.Fragment>Loading</React.Fragment>:(
			<Grid item xs={12}>
			<Paper elevation={2}>
				<Grid item align="center" xs={12}>
					<Typography 
						align="center" 
						variant="h3">
						{this.state.gymClassMD['title']}
					</Typography>
					<Typography 
						align="center" 
						variant="h4">
						{this.state.gymClassMD['boxTitle']}
					</Typography>
				</Grid>

				<React.Fragment>
				{
					this.state.wods.length > 0?
					<SearchSortTable
						rows = {this.state.wods}
						filteredRows={this.state.wods}
						headers={this.isOwner()? sortableHeadersOwner: sortableHeadersUser}
						handleRemove={this.handleRemoveWod.bind(this)}
						handleEdit={this.handleEdit.bind(this)}
						showOwnerBtns={this.isOwner()}
					/>
				:
					<Grid xs={12}>
						<Paper elevation={2}>
							<Typography>No wods</Typography>
						</Paper>
					</Grid>
				}
				</React.Fragment>
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
				title={this.state.editWodInfo["title"]}
				wodText={this.state.editWodInfo["wodText"]}
			/>
			</Grid>
		)
  }
}

export default BoxView = withTheme(BoxView);

