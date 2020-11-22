import firebase from "../context/firebaseContext"
import "firebase/auth";
import "firebase/database"; 
import vega from "vega-statistics"

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

import BarChart from "../comps/barChart"

import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import postData from "../utils/api"
import "../styles.css"


var db = firebase.database();





class ScoreDataView extends Component {
	constructor(props){
		super(props)
		this.state = {
			wodID: props.wodID,
			scores: new Array(),
			rawScores: new Array()
		}
	}

	getRawScores(arr){
		return arr.map(score => {
			return score.get("score")
		})
	}

	getSummaryStats(){
		// total scores, average score, median score, percentiles, Standar deviations
	}

	componentDidMount(){
		let scoresPath = `scores/${this.state.wodID}`
		this.scoreListener  = db.ref(scoresPath).on("value", ss => {
			if(ss && ss.exists()){
				let arr = this.objListToArray(ss.val())
				this.setState({scores: arr, rawScores: this.getRawScores(arr)})
			}
		})
	}

	componentWillReceiveProps(newProps){
		this.setState({...newProps})
	}

	componentWillUnmount(){
		console.log("Component will unmount")
		
	}

	objListToArray(obj){
		return Array.from(Object.entries(obj), entry => {
			 return new Map(Object.entries(entry[1]));
		})
	}

	

  render(){
  	let values = [
		        {"category": "A", "amount": 28},
		        {"category": "B", "amount": 55},
		        {"category": "C", "amount": 43},
		        {"category": "D", "amount": 91},
		        {"category": "E", "amount": 81},
		        {"category": "F", "amount": 53},
		        {"category": "G", "amount": 19},
		        {"category": "H", "amount": 87}
		      ]
	return(
		<Grid item xs={12}>
			
			<Paper elevation={2}> 
				
				<BarChart values={values} />
			</Paper>
		</Grid>
	)
  }
}




  
export default ScoreDataView = withTheme(ScoreDataView);

