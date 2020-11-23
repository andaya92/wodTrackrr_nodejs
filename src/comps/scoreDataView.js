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

import {
	mean, median, standardDeviation
}from 'simple-statistics'

import LineChart from "../comps/lineChart"
import BarChart from "../comps/barChart"

import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import postData from "../utils/api"
import {cvtTimetoInt, cvtIntToTime} from "../utils/formatting"
import "../styles.css"


var db = firebase.database();


class ScoreDataView extends Component {
	constructor(props){
		super(props)
		this.state = {
			wodID: props.wodID,
			scores: new Array(),
			rawScores: new Array(),
			dataType: "",
			stats: new Map()
		}
	}

	getRawScores(arr){
		return arr.map(score => {
			return score.get("score")
		})
	}



	componentDidMount(){
		let scoresPath = `scores/${this.state.wodID}`
		this.scoreListener  = db.ref(scoresPath).on("value", ss => {
			if(ss && ss.exists()){
				let [scores, rawScores, scoreType] = this.getData(ss.val())
				let stats = this.getDescStats(rawScores)
				console.log(stats)
				this.setState({
					scores: scores, 
					rawScores: rawScores, 
					dataType: scoreType, 
					stats: stats
				})
			}
		})
	}

	componentWillReceiveProps(newProps){
		this.setState({...newProps})
	}

	componentWillUnmount(){
		console.log("Component will unmount")
		
	}


	getData(obj){
		// create two arrays
		// One for data display in graph, 
		//		[ {"category": "A", "amount": 28}, ... ]
		// Second to crunch data, raw values
		/*
				key			(uid)
				boxID: 		"-MMVcVjihF2bXFc6qIEp"
				score:  	"321"
				username:  	"TestOwner"
				wodID:  	"-MMjP1_MQH23dnFQOfjR"
		*/
		let data = []
		let values = []
		let scoreType = ""

		// extract scores form obj and convert time to integer of seconds
		for(let item of Object.values(obj)){
			values.push(cvtTimetoInt(item.score))
			scoreType = item.scoreType
		}

		// sort scores
		values.sort((x,y) => {
			if(scoreType === "time"){
				return x - y
			}else if(scoreType === "reps"){
				return this.cvtReps(x) - this.cvtReps(y)
			}
			return 1
		})

		// create data list for chart 
		for(let i =0; i < values.length; i++){
			 data.push({"x": i, "y": values[i], "c": 0})
		}
		return [data, values, scoreType]
	}

	 getDescStats(vals){
		let stats = [
			['min', Math.min(...vals)],
			['max', Math.max(...vals)],
			['mean', mean(vals)],
			['median', median(vals)],
			['sd', standardDeviation(vals)]
		]
		return new Map(stats)
    }
	

  render(){
	return(
		<Grid item xs={12}>
			<Paper>
				<Typography>Low: {cvtIntToTime(this.state.stats.get("min"))}</Typography>
				<Typography>High: {cvtIntToTime(this.state.stats.get("max"))}</Typography>
			</Paper>
			<Paper elevation={2}> 
				<LineChart 
					data = {this.state.scores}
					values={this.state.rawScores}
					dataType={this.state.dataType} />

				<BarChart 
					data = {this.state.scores}
					values={this.state.rawScores}
					dataType={this.state.dataType} />
			</Paper>
		</Grid>
	)
  }
}




  
export default ScoreDataView = withTheme(ScoreDataView);

