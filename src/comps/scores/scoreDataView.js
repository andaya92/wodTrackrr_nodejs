import React, { Component } from 'react'

import {
	Grid, Paper, Typography
} from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';

import {
	mean, median, standardDeviation
}from 'simple-statistics'

import LineChart from "../lineChart"
import BarChart from "../barChart"

import {cvtTimetoInt, cvtIntToTime} from "../../utils/formatting"
import "../../styles.css"

function transformData(scores){
	/*
		create two arrays
		One for data display in graph,
				[ {"category": "A", "amount": 28}, ... ]
		Second to crunch data, raw values
			key	=> uid
				boxID: 		"-MMVcVjihF2bXFc6qIEp"
				score:  	"321"
				username:  	"TestOwner"
				wodID:  	"-MMjP1_MQH23dnFQOfjR"
	*/
	let graphData = []
	let scoreType = ""
	let values = scores.map(score => {
		scoreType = score.scoreType
		return (score.scoreType === "time") ? cvtTimetoInt(score.score)
			: parseFloat(score.score)
	})

	// create data list for chart
	for(let i =0; i < values.length; i++){
		 graphData.push({"x": i, "y": values[i], "c": 0})
	}
	return [graphData, values, scoreType, getDescStats(values)]
}

function getDescStats(vals){
	 console.log(vals)
	return {
		'min': Math.min(...vals),
		'max': Math.max(...vals),
		'mean': mean(vals),
		'median': median(vals),
		'sd': standardDeviation(vals)
	}
}

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

	static getDerivedStateFromProps(props, state){
		let data = transformData(props.scores)
		let [graphData, rawScores, scoreType, stats] = data

		return {...props,
			graphData: graphData,
			rawScores: rawScores,
			scoreType: scoreType,
			stats: stats
		}
	}

	componentDidUpdate(){

	}

	componentWillUnmount(){
		console.log("Component will unmount")
	}



  render(){
	return(
		<Grid item xs={12}>
			<Grid item container align="center" spacing={1} xs={12}>
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

