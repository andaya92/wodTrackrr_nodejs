import firebase from "../../context/firebaseContext"
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
import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import {
	mean, median, standardDeviation
}from 'simple-statistics'

import LineChart from "../lineChart"
import BarChart from "../barChart"

import {cvtTimetoInt, cvtIntToTime, cvtTimetoIntList} from "../../utils/formatting"
import "../../styles.css"


var db = firebase.database();


class ScoreDataView extends Component {
	constructor(props){
		super(props)
		this.state = {
			scores: props.scores, // array of objects
			graphData: [],
			rawScores: [],
			scoreType: "",
			stats: {}
		}
		
	}

	componentWillReceiveProps(newProps){
		if(newProps.scores && newProps.scores.length > 0){
			let data = this.transformData(newProps.scores)
			let [graphData, rawScores, scoreType, stats] = data
			let showCharts = (rawScores.length > 1) ? true : false

			this.setState({...newProps,
				graphData: graphData, 
				rawScores: rawScores, 
				scoreType: scoreType, 
				stats: stats,
				showCharts: showCharts
			})
		}else{
			this.setState({...newProps})
		}
	}

	componentWillUnmount(){
		console.log("Component will unmount")
	}

	transformData(scores){
		// create two arrays
		// One for data display in graph, 
		//		[ {"category": "A", "amount": 28}, ... ]
		// Second to crunch data, raw values
		/*
				key	=> uid
					boxID: 		"-MMVcVjihF2bXFc6qIEp"
					score:  	"321"
					username:  	"TestOwner"
					wodID:  	"-MMjP1_MQH23dnFQOfjR"
		*/
		let graphData = []
		let scoreType = ""
		let values = scores.map(score => {
			console.log(score)
			scoreType = score.scoreType
			return (score.scoreType === "time") ? cvtTimetoInt(score.score)
				: parseFloat(score.score)
		})
		
		// create data list for chart 
		for(let i =0; i < values.length; i++){
			 graphData.push({"x": i, "y": values[i], "c": 0})
		}
		return [graphData, values, scoreType, this.getDescStats(values)]
	}

	 getDescStats(vals){
		return {
					'min': Math.min(...vals),
					'max': Math.max(...vals),
					'mean': mean(vals),
					'median': median(vals),
					'sd': standardDeviation(vals)
				}
    }

  render(){
	return(
		<Grid item xs={12}>
			<Grid item container align="center" xs={12}>
				<Grid item xs={4}>
					<Paper elevation={6}>
						<Typography>
							Low: {this.state.scoreType === "time" ? 
								cvtIntToTime(this.state.stats["min"])
								: this.state.stats["min"]}
						</Typography>
					</Paper>
				</Grid>
				<Grid item xs={4}>
					<Paper elevation={6}>
						<Typography>
							High: {this.state.scoreType === "time" ?
							cvtIntToTime(this.state.stats["max"])
							: this.state.stats["max"]}
						</Typography>
					</Paper>
				</Grid>
				<Grid item xs={4}>
					<Paper elevation={6}>
						<Typography >
							Avg: {this.state.scoreType === "time" ?
							cvtIntToTime(this.state.stats["mean"])
							: this.state.stats["mean"]}
						</Typography>
					</Paper>
				</Grid>
			</Grid>

			<Grid item xs={12}>
					<LineChart 
						data = {this.state.graphData}
						values={this.state.rawScores}
						scoreType={this.state.scoreType}
						stats={this.state.stats} />
			</Grid>
			<Grid item xs={12}>
					<BarChart 
						data = {this.state.graphData}
						values={this.state.rawScores}
						scoreType={this.state.scoreType}
						stats={this.state.stats} />
			</Grid>
		</Grid>
	)
  }
}
export default ScoreDataView = withTheme(ScoreDataView);

