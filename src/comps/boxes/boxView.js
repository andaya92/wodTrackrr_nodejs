// Firebase
import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/database"; 

// React
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom';

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
import EditWod from "../wods/editWod"
import { removeWod } from "../../utils/firebaseData"
import SearchSortTable from "../searchSortTable"
import ActionCancelModal from "../actionCancelModal"
import "../../styles.css"


var db = firebase.database();



/*
	Given:
		userMD: props.userMD,
		boxID: props.boxID,
	Show:
		details of Box and its WODS, allows for removal of wods by owner
*/


class BoxView extends Component {
	constructor(props){
		super(props)
		this.state = {
			userMD: props.userMD,
			boxID: props.boxID,
			boxMD: new Map(),
			userBoxes: props.userBoxes, // from boxListAccordion from OwnerBox
			hasBoxes: props.hasBoxes,   // from boxListAccordion from OwnerBox
			wods: new Array(),
			showWodList: true,
			currentWodID: "",
			currentWodMD: new Map(),
			showRemoveAlert: false,
			showEditModal: false,
			editWodInfo: new Map(),
			curRemoveWodBoxID: "",
			curRemoveWodID: "",
			curRemoveWodTitle: ""

		}
		this.wodPath = `wods/${this.props.boxID}`
		this.boxPath = `boxes/${this.props.boxID}`
	}


	componentDidMount(){
		this.boxListener  = db.ref(this.boxPath).on("value", ss => {
			if(ss && ss.exists()){
				let boxMD = new Map(Object.entries(ss.val()))
				this.setState({boxMD: boxMD})
			}
		})

		this.wodListener  = db.ref(this.wodPath).on("value", ss => {
			if(ss && ss.exists()){
				let wods = this.objListToArray(ss.val())
				this.setState({
					wods: wods
				})
			}
		})
	}



	componentWillReceiveProps(newProps){
		this.setState({...newProps})
	}

	componentWillUnmount(){
		this.wodListener()
		this.boxListener()
	}

	// 
	objListToArray(obj){
		return Array.from(Object.entries(obj), entry => {
			 return new Map(Object.entries(entry[1]));
		})
	}

	handleScoreView(wodMD){
		this.setState({showWodList: false, currentWodMD: wodMD})
	}

	handleBack(){
		this.setState({showWodList: true})
	}

	handleModalClose(){
	  	this.setState({showRemoveAlert:false})
	  }

	handleRemoveWod(wodInfo){
		console.log(wodInfo)
		this.setState({
			showRemoveAlert: true,
			curRemoveWodBoxID: wodInfo.get("boxID"),
			curRemoveWodID: wodInfo.get("wodID"),
			curRemoveWodTitle: wodInfo.get("title"),
		})
	}

	deleteWod(){
		let wodPath = `wods/${this.state.curRemoveWodBoxID}/${this.state.curRemoveWodID}`
		let scorePath = `scores/${this.state.curRemoveWodID}`

		removeWod(wodPath, scorePath)
		.then((res) => {
			console.log(res)
			this.setState({showRemoveAlert: false})
		})
	}

	onKeyUp(data){
		if((data.keyCode || data.which) == 13){
		    
		}
	}
	/*
		Search bar, filter by name
	*/
	onChange(ev){
		let val = ev.target.value
		let filteredWods = this.state.wods.filter(wod =>{
		  return wod.get("title").toLowerCase().includes(val.toLowerCase())
		})
		this.setState({filteredWods: filteredWods})
	}


	handleEdit(info){
		console.log("Populate with info, show in modal with form")
		console.log(info)
		this.setState({
			editWodInfo: info,
			showEditModal: true
		})
	}
	handleEditModalClose(){
		this.setState({showEditModal: false})
	}

  render(){
  	let showOwnerBtns = this.state.boxMD.get("ownerUID") === this.state.userMD.uid && !this.props.isReadOnly


 	let sortableHeadersOwner = [
 		{id:"date", sortable:true, label:"Date"},
 		{id:"title", sortable:true, label:"Title"},
 		{id:"scoreType", sortable:true, label:"Scoring"},
 		{id:"wodText", sortable:false, label:"Wod"},
 		{id:"view", sortable:false, label:""},
 		{id:"edit", sortable:false, label:""},
 		{id:"remove", sortable:false, label:""}
 	]
 	let sortableHeadersUser = [
 		{id:"date", sortable:true, label:"Date"},
 		{id:"title", sortable:true, label:"Title"},
 		{id:"scoreType", sortable:true, label:"Scoring"},
 		{id:"wodText", sortable:false, label:"Wod"},
 		{id:"view", sortable:false, label:""}
 	]
 
	return(
		<Grid item xs={12} align="center">
		<Paper elevation={2}>
			<Typography align="center" variant="h3">{this.state.boxMD.get("title")}</Typography>


			{this.state.showWodList
			?	
				<React.Fragment>
				{
					this.state.wods.length > 0?
					<SearchSortTable
						rows = {this.state.wods}
						filteredRows={this.state.wods}
						headers={showOwnerBtns? sortableHeadersOwner: sortableHeadersUser}
						handleView={this.handleScoreView.bind(this)}
						handleRemove={this.handleRemoveWod.bind(this)}
						handleEdit={this.handleEdit.bind(this)}
						showOwnerBtns={showOwnerBtns}
					/>
					:
					<React.Fragment></React.Fragment>

				}
				</React.Fragment>
			:
				<ScoreView 
					userMD={this.state.userMD}
					wodMD={this.state.currentWodMD} 
					handleBack={this.handleBack.bind(this)}/>

			}
		</Paper>



		<Grid item xs={12} align="center">
			<Button variant="outlined" color="secondary" onClick={()=>{this.props.handleBack()}}>Back</Button>
		</Grid>
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
			title={this.state.editWodInfo.get("title")}
			wodText={this.state.editWodInfo.get("wodText")}

		/>
		</Grid>
	)
  }
}




  
export default BoxView = withTheme(BoxView);

