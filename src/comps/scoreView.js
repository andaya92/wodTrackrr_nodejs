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
			<ListItemText primary={username}/>
			<ListItemText primary={score}/>
		</ListItem>
	)
}

class ScoreView extends Component {
	constructor(props){
		super(props)
		let wodID = props.wodMD.get("wodID")
		this.state = {
			userMD: props.userMD,
			wodID: wodID,
			wodMD: props.wodMD,
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

	handleAddScore(){
		if(!this.state.userMD){return}
		let userScore =  document.getElementById("scoreViewUserScore").value
		let username = this.state.userMD.username
		let uid = this.state.userMD.uid
		

		let path = `scores/${this.state.wodID}/${uid}`
		console.log(username, userScore, uid)
		db.ref(path).set({
			username: username,
			score: userScore,
			wodID: this.state.wodMD.get("wodID"),
			boxID: this.state.wodMD.get("boxID")
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
					<Typography>{this.state.wodMD.get("scoreType")}</Typography>
					<TextField
		              id="scoreViewUserScore"
		              type="text"
		              style={{ margin: 8}}
		              pattern="[\sA-Za-z0-9]{35}"
		              inputProps={{
		                title: "Letters only, max length 35",
		                placeholder: "Score"
		              }}
		              margin="normal"
		              color="primary"
		              InputLabelProps={{
		                shrink: true,
		              }}
		            />
		            <Button variant="outline" color="primary" onClick={this.handleAddScore.bind(this)}>Add</Button>


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
		<Grid item xs={12}>
			<Button variant="outlined" color="secondary" onClick={()=>{this.props.handleBack()}}>Back</Button>
		</Grid>
		</Grid>
	)
  }
}




  
export default ScoreView = withTheme(ScoreView);

