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
import { setScore } from "../../utils/firestore/scores"
import "../../styles.css"


var db = firebase.database();

class AddScore extends Component{
	constructor(props){
		super(props)
		this.state = {
			userMD: props.userMD,
			wodMD: props.wodMD
		}
		console.log(props)
	}

	static getDerivedStateFromProps(props, state){
		return props
	}

	objListToArray(obj){
		// let key = Object.keys(obj)[0]
		return Array.from(Object.entries(obj), entry => {
			 return new Map(Object.entries(entry[1]));
		})
	}

	isNumInSane(s){
		let hasNonDigitRegex = /\D/
		let res = s.search(hasNonDigitRegex) 
		let isSane = (res === -1) ? true: false
		return isSane 
	}

	handleAddScore(){
		if(!this.state.userMD){return}

		let userScore = ""
		if(this.state.wodMD['scoreType'] === "time"){
			let mins =  document.getElementById("scoreViewUserScoreMins").value
			let secs =  document.getElementById("scoreViewUserScoreSecs").value
			if(!this.isNumInSane(mins) || !this.isNumInSane(secs)){
				alert(`Time must only contain numbers, entered: ${mins}:${secs}`)
				return
			}
			if(parseInt(secs) > 59){
				alert(`Seconds must be 59 or below, entered: ${secs}`)
				return
			}
			if(parseInt(secs) < 10 && secs.length === 1){
				secs = `0${secs}`
			}
			if(isNaN(parseInt(secs)) ||  isNaN(parseInt(mins))){
				alert(`Missing field, entered: ${mins}:${secs}`)
				return
			}
			if(mins.length > 2){
				alert(`Minutes must be 99 or below, entered: ${mins}`)	
				return
			}
			if(mins.length === 0){
				mins = "0"
			}
			if(secs.length === 0){
				secs = "0"
			}
			userScore = `${mins}:${secs}`
		}else{
			// reps or rounds
			userScore =  document.getElementById("scoreViewUserScore").value
			if(userScore.length > 3){
				alert(`Score must be 3 digits or less, entered: ${userScore}`)
				return
			}
			if(!userScore){
				alert("Must enter score.")
				return
			}
			if(!this.isNumInSane(userScore)){
				alert(`Score must be digits only, entered: ${userScore}`)
				return
			}
		}

		let username = this.state.userMD.username
		let uid = this.state.userMD.uid
		let wodID = this.state.wodMD["wodID"]
		let gymClassID = this.state.wodMD["gymClassID"]
		let boxID = this.state.wodMD["boxID"]
		let title = this.state.wodMD["title"]
		let scoreType = this.state.wodMD["scoreType"]
		
		setScore(title, username, uid, userScore, wodID, gymClassID, boxID, scoreType)
		.then((res) => console.log(res))
		.catch((err) => console.log(err))
	}

  render(){
	return(
		<Grid item xs={12} style={{margin: "0px 0px 8px 0px"}}>
			<Accordion>
				<AccordionSummary
					style={{background: this.props.theme.palette.primary.main}}
					expandIcon={<ExpandMoreIcon />}
					aria-label="Expand"
					aria-controls="additional-actions2-content"
					id="additional-actions2-header">
					<Typography >
						Add Score
					</Typography>	        
				</AccordionSummary>
				<AccordionDetails>
					<Grid item container xs={12}>
						<Grid item xs={12}>
						<Typography>
							{this.state.wodMD['scoreType']
								.replace(
									this.state.wodMD['scoreType'][0],
									this.state.wodMD['scoreType'][0].toUpperCase())
							}
						</Typography>

						</Grid>
						<Grid item xs={12}>
							<TableContainer>
							<Table>
							<TableBody>
								<TableRow>
									{this.state.wodMD.scoreType === "time" ?
										<React.Fragment>
										<TableCell align="center">
											<TextField
												id="scoreViewUserScoreMins"
												type="number"
												style={{ margin: 8}}
												pattern="[0-9]{3}"
												inputProps={{
													title: "Numbers only, max length 3",
													placeholder: "Minutes"
												}}
												style={{width: "100%"}}
												margin="normal"
												color="primary"
												InputLabelProps={{
													shrink: true,
												}}
												/>
										</TableCell>
										<TableCell align="center">
											<TextField
												id="scoreViewUserScoreSecs"
												type="number"
												style={{ margin: 8}}
												pattern="[0-9]{2}"
												inputProps={{
													title: "Numbers only, max length 2",
													placeholder: "Seconds"
												}}
												style={{width: "100%"}}
												margin="normal"
												color="primary"
												InputLabelProps={{
													shrink: true,
												}}
												/>
										</TableCell>
										</React.Fragment>
									:	
										<TableCell align="center" colSpan={2}>
											<TextField
											id="scoreViewUserScore"
											type="number"
											style={{ margin: 8}}
											pattern="[0-9]{4}"
											inputProps={{
												title: "Numbers only, max length 4",
												placeholder: "Score"
											}}
											margin="normal"
											style={{width: "100%"}}
											color="primary"
											InputLabelProps={{
												shrink: true,
											}}
											/>
										</TableCell>	
									}
								</TableRow>
								<TableRow>
									<TableCell colSpan={3} align="center">
										<Button  color="primary" style={{width: "100%"}} variant="outlined"
											onClick={this.handleAddScore.bind(this)}>
											Add
										</Button>
									</TableCell>
								</TableRow>
								</TableBody>
							</Table>
							</TableContainer>
							
						</Grid>
					</Grid>
				</AccordionDetails>
			</Accordion>		
		</Grid>
	)
  }
}

  
export default AddScore = withTheme(AddScore);

