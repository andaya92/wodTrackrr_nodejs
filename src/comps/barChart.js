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
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

// Stats
import {
	mean, median, standardDeviation
}from 'simple-statistics'

import {cvtTimetoInt, cvtIntToTime} from "../utils/formatting"
import "../styles.css"

import Chart from 'chart.js';



var db = firebase.database();

class BarChart extends Component {
	constructor(props){
		super(props)
		this.state = {
			scoreType: props.scoreType,
			data: props.data, // x y values for chart
			values: props.values, // raw score values
			stats: new Map() // mean, median, SD
		}
	}

	componentWillReceiveProps(newProps){
		this.setState({
			...newProps,
		}, () => {
			if(this.state.values.length > 0)
				this.createChart(this.binData(this.state.values))
		})
	}

	createChart([labels, data]){
		this.ctx = document.getElementById('barChart');
		let context = this.ctx.getContext('2d')
		let grd = context.createLinearGradient(200,0,200,400);
		grd.addColorStop(0,"#01d3fe");
		grd.addColorStop(1,"#0890fd");

		if(this.barChart){
			this.barChart.destroy()
		}
		this.barChart = new Chart(this.ctx, {
		    type: 'bar',
		    data:  {
		    	labels: labels,
			    datasets: [{
			    	'label': "Scores (Standard Deviation)",
			        minBarLength: 1,
			        backgroundColor: grd,
			        data: data
			    }]
			},
			options:{
				maintainAspectRatio: false
			}
		});
	}

	format(x){
		if(this.state.scoreType === "time"){
			return x <= 0 ? 0 : cvtIntToTime(x)
		}else if(this.state.scoreType === "reps"){
			return parseFloat(x)
		}
	}

	createLabels(_mean, sd){
		let bins = []

		for(let i=0; i<3; i++){
			let binA = `${this.format(_mean - (sd * (i + 1)))} - ${this.format(_mean - (sd * i))}`
			let binB = `${this.format(_mean + (sd * i))} - ${this.format(_mean + (sd * (i + 1)))}`	
			bins.unshift(binA)
			bins.push(binB)
		}
		return bins
	}

	binData(values){
		/*
			{x: binValue, y: countOfbin}
			6 bins 1,2,3 SD from Mean each way
		*/
		console.log(values)
		let sd = standardDeviation(values)
		let _mean = mean(values)
		let labels = this.createLabels(_mean, sd)
		let binnedData = [0, 0, 0, 0, 0, 0]
		for(let x of values){
		 		let diff = (x - _mean) // 11 - 10 => 1
		 		let numSDAway = Math.floor(diff / sd) // 5 / 2 => .5 => 0
		 		console.log(`SD: ${sd}, x: ${x}, mean: ${_mean} Diff: ${diff}, sdAway: ${numSDAway}`)
		 		if(Math.abs(numSDAway) <= 1){
		 			if(diff > 0){
		 				binnedData[3]++
		 			}else{
		 				binnedData[2]++
		 			}
		 		}else if(Math.abs(numSDAway) <= 2){
		 			if(diff > 0){
		 				binnedData[4]++
		 			}else{
		 				binnedData[1]++
		 			}
		 		} else{
		 			if(diff > 0){
		 				binnedData[5]++
		 			}else{
		 				binnedData[0]++
		 			}
		 		}
		 }
		 
		 return [labels, binnedData]
	}

  render(){

	return(
		<Grid item xs={12}>
			<div style={{height:"25vh", "max-width":"50vw"}}>
				<canvas id="barChart"></canvas>
			</div>
		</Grid>
	)
  }
}




  
export default BarChart = withTheme(BarChart);

