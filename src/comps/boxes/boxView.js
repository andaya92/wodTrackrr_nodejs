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
			boxID: props.boxID,
			boxMD: {}
		}
	}


	getBoxListener(){
		if(!this.boxListener){
			this.boxListener = fs.collection("boxes").doc(this.state.boxID)
			.onSnapshot(ss => {
				console.log(ss)
				console.log(this.state.boxID)
				console.log(ss.data())

				if(ss.exists){

					this.setState({boxMD: ss.data()})	
				}else{
					this.setState({boxMD: {}})
				}
			}, err => {
				console.log(err)
			})
		}
	}

	
	checkListeners(){
		if(this.boxListener === undefined)
			this.getBoxListener()	
	}

	componentDidMount(){
		this.checkListeners()
	}

	static getDerivedStateFromProps(props, state){
		return props
	}
	
	componentDidUpdate(){
		this.checkListeners()
	}

	componentWillUnmount(){	
		if(this.boxListener)
			this.boxListener()
	}

	render(){
		let uid = this.state.userMD.uid
		let boxOwnerUid = this.state.boxMD["uid"]
		let showOwnerBtns = uid === boxOwnerUid

		return(
			<Grid item xs={12}>
				{Object.keys(this.state.boxMD).length > 0 ?
					<GymClassList 
						user={this.state.user}
						userMD={this.state.userMD}
						boxID={this.state.boxID}
						isOwner={showOwnerBtns}
					/>
				:
					<React.Fragment></React.Fragment>
				}

			</Grid>
		)
	}
}

export default BoxView = withTheme(BoxView);

