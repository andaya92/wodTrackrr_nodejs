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


import postData from "../../utils/api"
import {cvtTimetoInt, cvtIntToTime, cvtTimetoIntList} from "../../utils/formatting"
import "../../styles.css"


var db = firebase.database();


class ScoreDataView extends Component {
	constructor(props){
		super(props)
		this.state = {
			wodID: props.wodID,
			graphData: new Array(),
			rawScores: new Array(),
			scoreType: "",
			stats: new Map()
		}
		
	}

	componentDidMount(){
		let scoresPath = `scores/${this.state.wodID}`
		this.scoreListener  = db.ref(scoresPath).on("value", ss => {
			if(ss && ss.exists()){
				/*ss.val() looks like this object from the path scores/wodID
					scores/wodID: {
						uid: {
							scoreinfo
						},
						uid: {...},
						...
					}
				*/
				let [graphData, rawScores, scoreType] = this.getData(ss.val())
				let stats = this.getDescStats(rawScores)
				let showCharts = (rawScores.length > 1) ? true : false

				this.setState({
					graphData: graphData, 
					rawScores: rawScores, 
					scoreType: scoreType, 
					stats: stats,
					showCharts: showCharts
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
				key	=> uid
					boxID: 		"-MMVcVjihF2bXFc6qIEp"
					score:  	"321"
					username:  	"TestOwner"
					wodID:  	"-MMjP1_MQH23dnFQOfjR"
		*/
		let graphData = []
		let values = []
		let scoreType = ""

		// extract scores form obj and convert time to integer of seconds
		for(let item of Object.values(obj)){
			scoreType = item.scoreType
			if(item.scoreType === "time"){
				values.push(cvtTimetoInt(item.score))
			}else if(item.scoreType === "reps"){
				values.push(parseFloat(item.score))
			}
		}

		// sort scores
		values.sort((x,y) => {
			if(scoreType === "time"){
				return x - y
			}else if(scoreType === "reps"){
				return parseFloat(x) - parseFloat(y)
			}
			return 1
		})

		// create data list for chart 
		for(let i =0; i < values.length; i++){
			 graphData.push({"x": i, "y": values[i], "c": 0})
		}
		return [graphData, values, scoreType]
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
			<Grid item container align="center" xs={12}>
				<Grid item xs={4}>
					<Paper elevation={6}>
						<Typography>
							Low: {this.state.scoreType === "time" ? 
								cvtIntToTime(this.state.stats.get("min"))
								: this.state.stats.get("min")}
						</Typography>
					</Paper>
				</Grid>
				<Grid item xs={4}>
					<Paper elevation={6}>
						<Typography>
							High: {this.state.scoreType === "time" ?
							cvtIntToTime(this.state.stats.get("max"))
							: this.state.stats.get("max")}
						</Typography>
					</Paper>
				</Grid>
				<Grid item xs={4}>
					<Paper elevation={6}>
						<Typography >
							Avg: {this.state.scoreType === "time" ?
							cvtIntToTime(this.state.stats.get("mean"))
							: this.state.stats.get("mean")}
						</Typography>
					</Paper>
				</Grid>
			</Grid>

			<Grid item xs={12}>
					<LineChart 
						data = {this.state.graphData}
						values={this.state.rawScores}
						scoreType={this.state.scoreType} />
			</Grid>
			<Grid item xs={12}>
					<BarChart 
						data = {this.state.graphData}
						values={this.state.rawScores}
						scoreType={this.state.scoreType} />
			</Grid>
		</Grid>
	)
  }
}
export default ScoreDataView = withTheme(ScoreDataView);

