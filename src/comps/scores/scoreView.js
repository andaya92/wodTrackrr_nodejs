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

import { setScore, removeScore } from "../../utils/firebaseData"
import "../../styles.css"


var db = firebase.database();


/*
Show details of Box and its WODS
*/
function ScoreRow(props){
	let score = props.info.get("score")
	let username = props.info.get("username")
	let wodID = props.info.get("wodID")
	let uid = props.info.get("uid")
	let scoreID = `${wodID}/${uid}`
	let rowStyle = (props.isUserScore)? "": ""
	console.log(props.info)
	return(
		<TableRow selected={props.isUserScore}>
				<TableCell>
					{username}
				</TableCell>
				<TableCell>
					{score} 
				</TableCell>
				{
		  			props.isUserScore
		  			?
			  		<TableCell>
					    <Button size="small" 
					    	color="error" 
					    	onClick={() => props.handleRemoveScore(scoreID)}>
					    	Remove
					    </Button>
			  		</TableCell>
			  		:
			  		<TableCell></TableCell>

		  		}
		</TableRow>
	)
}


/*
	Need to add scores to User in Firebase
	   users - uid - Score - wodId - score info

*/

class ScoreView extends Component {
	constructor(props){
		super(props)
		let wodID = props.wodMD.get("wodID")
		let scoreType = props.wodMD.get("scoreType")
		// console.log(`UserMD`)
		// console.log(this.props.userMD)
		this.state = {
			userMD: props.userMD,
			wodID: wodID,
			wodMD: props.wodMD,
			scoreType: scoreType,
			scores: new Array(),
			userScore: {},
			curRemoveScoreID: "",
			showRemoveAlert: false
		}
	}


	componentDidMount(){
		let scorePath = `scores/${this.state.wodID}`

		this.scoreListener  = db.ref(scorePath).on("value", ss => {
			if(ss && ss.exists()){
				let arr = this.objListToArray(ss.val())
	
				console.log("Score listener")
				console.log(arr)
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
		this.scoreListener()
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
		if(this.state.scoreType === "time"){
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
			if(!this.isNumInSane(userScore)){
				alert(`Score must be digits only, entered: ${userScore}`)
				return
			}

		}

		let username = this.state.userMD.username
		let uid = this.state.userMD.uid
		let wodID = this.state.wodMD.get("wodID")
		let boxID = this.state.wodMD.get("boxID")
		let title = this.state.wodMD.get("title")


		// each score can be idnetified by wodID/uid, enforces 1 score per workout per user
		let scorePath = `scores/${wodID}/${uid}`
		let userScorePath = `users/${uid}/scores/${boxID}/${wodID}`

		setScore( scorePath,
			title,
			username, 
			uid, 
			userScore,
			wodID,
			boxID,
			this.state.wodMD.get("scoreType")
		)
		.then((res) => console.log(res))
		.catch((err) => console.log(err))


		setScore( userScorePath,
			title,
			username, 
			uid, 
			userScore,
			wodID,
			boxID,
			this.state.wodMD.get("scoreType")
		)
		.then((res) => console.log(res))
		.catch((err) => console.log(err))
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
	}

  render(){
	return(
		<Grid item xs={12}>
		<Grid item xs={12}>
			<Typography>{this.state.wodMD.get("title")}</Typography>
			<Typography>{this.state.wodMD.get("scoreType")}</Typography>
			<ReactMarkdown>{this.state.wodMD.get("wodText")}</ReactMarkdown>
		</Grid>



		<Grid item xs={12}>
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
				<Grid container>
					<Grid  item xs={12} >
						<Typography >
							{this.state.scoreType
								.replace(
									this.state.scoreType[0],
									this.state.scoreType[0].toUpperCase())
							}
						</Typography>
					</Grid>

					{this.state.scoreType === "reps"
					?	<Grid item xs={10}>
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
			              color="primary"
			              InputLabelProps={{
			                shrink: true,
			              }}
			            />
			            </Grid>
			        :
			        	<React.Fragment>
			        	<Grid item xs={5}>
			        	<TextField
			              id="scoreViewUserScoreMins"
			              type="number"
			              style={{ margin: 8}}
			              pattern="[0-9]{3}"
			              inputProps={{
			                title: "Numbers only, max length 3",
			                placeholder: "Minutes"
			              }}
			              margin="normal"
			              color="primary"
			              InputLabelProps={{
			                shrink: true,
			              }}
			            />
			            </Grid>
			            <Grid item xs={5}>
			            <TextField
			              id="scoreViewUserScoreSecs"
			              type="number"
			              style={{ margin: 8}}
			              pattern="[0-9]{2}"
			              inputProps={{
			                title: "Numbers only, max length 2",
			                placeholder: "Seconds"
			              }}
			              margin="normal"
			              color="primary"
			              InputLabelProps={{
			                shrink: true,
			              }}
			            />
			            </Grid>
			        	</React.Fragment>

					}
					<Grid item xs={2}>
		            	<Button variant="outline" color="primary" onClick={this.handleAddScore.bind(this)}>Add</Button>
		            </Grid>
		        </Grid>
				</AccordionDetails>
			</Accordion>		
		</Grid>

		<Grid item xs={12}>
			<ScoreDataView 
				wodID={this.state.wodMD.get("wodID")} 
			/>
		</Grid>
		<Grid item xs={12}>
			<Paper>
			{this.state.scores.length > 0?
				<TableContainer component={Paper}>
				<Table aria-label="score table">
				<TableHead>
					<TableCell>Username</TableCell>
					<TableCell>Score</TableCell>
					<TableCell></TableCell>
				</TableHead>
				<TableBody>
					{
					this.state.scores.map(score => {
						let isCurUserScore = 
							(this.state.userMD["uid"] == score.get("uid"))? true : false
						return <ScoreRow 
							info={score}
							handleRemoveScore = {this.handleRemoveScore.bind(this)}
							isUserScore={isCurUserScore} 
						/>
					})
					}
			    </TableBody>
			    </Table>
			    </TableContainer>
			:
				<Grid item xs={12}>
					<Card variant="outlined" color="primary">
					  <CardContent>
					    <Typography variant="h5" component="h2"gutterBottom>
					   	No Scores!
					    </Typography>
					   </CardContent>
					</Card>
				</Grid>
			}
			</Paper>
		</Grid>
		<Grid item xs={12} align="center">
			<Button variant="outlined" color="secondary" onClick={()=>{this.props.handleBack()}}>Back</Button>
		</Grid>
		<Modal
	        open={this.state.showRemoveAlert}
	        onClose={this.handleModalClose.bind(this)}
	        aria-labelledby="simple-modal-title"
	        aria-describedby="simple-modal-description"
		    >
	    	<div style={{
				position: 'absolute',
				top: "50%",
				left: "50%",
				width: "80vw",
			    transform: "translate(-50%, -50%)",
			}}>
				<Grid item align="center" xs={12}>
	    		<Paper style={{height:"25vh", display: "flex", flexDirection: "column",justifyContent: "center"}}>
	    			<Typography style={{position: ""}}>
	    				 Remove score?
	    			</Typography>
	    			
	    			<Button color="primary" variant="outlined" 
	    				onClick={()=>{ this.removeScore()}}>
	    					Delete
	    			</Button>
	    		</Paper>
	    		</Grid>
	    	</div>
		</Modal>
		</Grid>
	)
  }
}




  
export default ScoreView = withTheme(ScoreView);

