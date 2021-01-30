import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/database"; 

import ReactMarkdown from 'react-markdown'

import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import 
{ 	Grid, Paper, Button, Typography, Collapse, TextField, Select,
	Accordion, AccordionSummary, AccordionDetails, FormControlLabel,
	CircularProgress, LinearProgress, CardActions, Card, CardContent,
	ListItem, List, ListItemText, TableRow, TableHead, TableContainer,
	TableCell, TableBody, Table, Modal
} 
from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import ScoreDataView from "./scoreDataView" 
import ScoreList from "./scoreList"
import AddScore from "./addScore" 
import ActionCancelModal from "../actionCancelModal"

import { setScore, removeScore } from "../../utils/firebaseData"
import "../../styles.css"


var db = firebase.database();



class ScoreView extends Component {
	constructor(props){
		super(props)
		let wodID = props.wodMD.get("wodID")
		let scoreType = props.wodMD.get("scoreType")
		let boxID = props.wodMD.get("boxID")

		// console.log(`UserMD`)
		// console.log(this.props.userMD)
		this.state = {
			userMD: props.userMD,
			wodID: wodID,
			wodMD: props.wodMD,
			boxID: boxID,
			scoreType: scoreType,
			scores: new Array(),
			userScore: {},
			curRemoveScoreID: "",
			showRemoveAlert: false
		}
	}


	componentDidMount(){
		let scorePath = `scores/${this.state.wodID}`
		let userScorePath = `users/${this.state.userMD.uid}/scores/`+
			`${this.state.boxID}/${this.state.wodID}`
		
		this.userScoreListener = db.ref(userScorePath).on("value", userScore => {
			if(userScore && userScore.exists()){
				console.log("userScoreListener")

				this.setState({userScore: userScore.val()})
			}
		})

		this.scoreListener  = db.ref(scorePath).on("value", ss => {
			if(ss && ss.exists()){
				let arr = this.objListToArray(ss.val())
				/*
					sort score depending on:
						time (low to high) or 
						reps (high to low)
				*/
				let isTime = (this.state.scoreType && this.state.scoreType === "time") ? 1 : 0
				arr.sort((a,b) => {
					return isTime 
					?
						  parseFloat(a.get("score")) < parseFloat(b.get("score")) ? -1 : 1
					:
						 parseFloat(a.get("score")) > parseFloat(b.get("score")) ? 1 : -1

				})
				this.setState({scores: arr})
			}
		})
	}

	componentWillReceiveProps(newProps){
		this.setState({...newProps})
	}

	componentWillUnmount(){
		if(this.scoreListener() !== undefined)
			this.scoreListener()

		if(this.userScoreListener()!== undefined)
			this.userScoreListener()
		
	}

	objListToArray(obj){
		// let key = Object.keys(obj)[0]
		return Array.from(Object.entries(obj), entry => {
			 return new Map(Object.entries(entry[1]));
		})
	}

	handleModalClose(){
		this.setState({showRemoveAlert:false})
	}

	handleRemoveScore(scoreID){
		console.log(`Remove score with ID: ${scoreID}`)
		this.setState({curRemoveScoreID: scoreID, showRemoveAlert: true})
	}

	removeScore(){
		let scoreID = this.state.curRemoveScoreID
		if(scoreID === "" || scoreID.length <=0){return}

		this.setState({showRemoveAlert: false})

		removeScore(scoreID)
		.then((res)=>{
			console.log(res)
			this.setState({showRemoveAlert: false})			
		})
		.catch((err)=>{console.log(err)})
		console.log("Test change")
	}

  render(){
	return(
		<Grid item xs={12}>
		<Grid item align="center" xs={12}>
			<Typography>{this.state.wodMD.get("title")}</Typography>
			<Typography>Type: {this.state.wodMD.get("scoreType")}</Typography>
		</Grid>
		<Grid item container xs={12}>
			<Grid item xs={1}><span></span></Grid>
			<Grid item xs={11}>
				<ReactMarkdown>{this.state.wodMD.get("wodText")}</ReactMarkdown>
			</Grid>
		</Grid>
		<AddScore 
			userMD={this.state.userMD}
			wodMD={this.state.wodMD}
		/>
		<Grid item xs={12}>
			<ScoreDataView 
				wodID={this.state.wodMD.get("wodID")} 
			/>
		</Grid>
		<Grid item xs={12}>
			<Paper>		
			<ScoreList
				scores={this.state.scores}
				uid={this.state.userMD.uid}
				onRemove={this.handleRemoveScore.bind(this)}
			/>
			</Paper>
		</Grid>
		<Grid item xs={12} align="center">
			<Button variant="outlined" color="secondary" onClick={()=>{this.props.handleBack()}}>Back</Button>
		</Grid>
		<ActionCancelModal
			open={this.state.showRemoveAlert}
	        onClose={this.handleModalClose.bind(this)}
	        onAction={this.removeScore.bind(this)}
	        modalText={`Remove score?`}
	        actionText={`Remove`}
	        cancelText={`Cancel`}
	    />
		</Grid>
	)
  }
}
  
export default ScoreView = withTheme(ScoreView);


