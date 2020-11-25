import firebase from "../context/firebaseContext"
import "firebase/auth";
import "firebase/database"; 


import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import 
{ 	Grid, Paper, Button, Typography, Collapse, TextField, Select,
	Accordion, AccordionSummary, AccordionDetails, FormControlLabel,
	CircularProgress, LinearProgress, CardActions, Card, CardContent,
	ListItem, List, ListItemText
} 
from '@material-ui/core';

import ScoreDataView from "../comps/scoreDataView" 

import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import postData from "../utils/api"
import "../styles.css"


var db = firebase.database();


/*
Show details of Box and its WODS
*/
function Score(props){
	let score = props.info.get("score")
	let username = props.info.get("username")
	
	return(
		<ListItem>
			<Grid item xs={12}>
				<Grid item xs={6}>
					<ListItemText primary={username}/>
				</Grid>
				<Grid item xs={6}>
					<ListItemText primary={`${score}::how do I compare doe`}/> 
				</Grid>
			</Grid>
		</ListItem>
	)
}

class ScoreView extends Component {
	constructor(props){
		super(props)
		let wodID = props.wodMD.get("wodID")
		let scoreType = props.wodMD.get("scoreType")
		this.state = {
			userMD: props.userMD,
			wodID: wodID,
			wodMD: props.wodMD,
			scoreType: scoreType,
			scores: new Array()
		}
	}


	componentDidMount(){
		let scorePath = `scores/${this.state.wodID}`
		this.scoreListener  = db.ref(scorePath).on("value", ss => {
			if(ss && ss.exists()){
				this.setState({scores: this.objListToArray(ss.val())})
			}
		})
	}

	componentWillReceiveProps(newProps){
		this.setState({...newProps})
	}

	componentWillUnmount(){
		console.log("Component will unmount")
		this.scoreListener()
	}

	objListToArray(obj){
		return Array.from(Object.entries(obj), entry => {
			 return new Map(Object.entries(entry[1]));
		})
	}
	isNumInSane(s){
		
		let hasNonDigitRegex = /\D/
		let res = s.search(hasNonDigitRegex) 
		let isSane = (res === -1) ? true: false
		
		console.log(`String: ${s}, length: ${s.length}, isSane: ${isSane}`)
		return isSane 
		
	}

	handleAddScore(){
		console.log(this.state.userMD)
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
		

		let path = `scores/${this.state.wodID}/${uid}`
		console.log(username, userScore, uid)
		db.ref(path).set({
			username: username,
			score: userScore,
			wodID: this.state.wodMD.get("wodID"),
			boxID: this.state.wodMD.get("boxID"),
			scoreType: this.state.wodMD.get("scoreType")
		})
	}

  render(){
	return(
		<Grid item xs={12}>
		<Grid item xs={12}>
			<Typography>{this.state.wodMD.get("title")}</Typography>
			<Typography>{this.state.wodMD.get("scoreType")}</Typography>
			<Typography>{this.state.wodMD.get("wodText")}</Typography>
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
			{this.state.scores.length > 0
			?
				<List>
					{
					this.state.scores.map(score => {
						return <Score info={score} />
					})
					}
			    </List>
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
		</Grid>
	)
  }
}




  
export default ScoreView = withTheme(ScoreView);

