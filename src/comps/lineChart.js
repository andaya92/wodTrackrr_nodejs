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
import Chart from 'chart.js';

import {cvtTimetoInt, cvtIntToTime} from "../utils/formatting"
// Stats
import {
	mean, median, standardDeviation
}from 'simple-statistics'

import "../styles.css"


var db = firebase.database();


class LineChart extends Component {
	constructor(props){
		super(props)
		this.state = {
			scoreType: props.scoreType,
			data: props.data, // x y values for chart
			values: props.values, // raw score values
			stats: props.stats // mean, median, SD
		}
	}

	componentDidMount(){
		this.createChart()
	}

	createChart(){
		this.ctx = document.getElementById('lineChart');

		let context = this.ctx.getContext('2d')
		let grd = context.createLinearGradient(200,0,200,400);
		grd.addColorStop(0,"#01d3fe");

		grd.addColorStop(1,"#0890fd");

		if(this.lineChart){
			this.lineChart.destroy()
		}

		this.lineChart = new Chart(this.ctx, {
		    type: 'line',

		    data:  {
		    	label: "Scores",
			    datasets: [{
			    	label: "Score",
			        barPercentage: 0.5,
			        barThickness: 6,
			        maxBarThickness: 8,
			        minBarLength: 2,
			        backgroundColor: grd,
			        data: this.state.data
			    }]
			},
			options:{
				scales: {
		            yAxes: [{
		                ticks:{
		                	callback: (label, index, labels) => {
			                	if(this.state.scoreType === "time"){
			                		return cvtIntToTime(label)
			                	}else if(this.state.scoreType === "reps"){
			                		return label
			                	}
			                }
			             }
		            }]
			    },
			    tooltips: {
			        callbacks: {
			        	title: (tooltipItem, data) => {

			        	},
			            label: (tooltipItem, data) => {
			                var label = data.datasets[tooltipItem.datasetIndex].label || '';

			                if (label) {
			                    label += ': ';
			                }

			                if(this.state.scoreType === "time"){
		                		label += cvtIntToTime(tooltipItem.yLabel)
		                	}else if(this.state.scoreType === "reps"){
		                		label += tooltipItem.yLabel
		                	}


			                return label;
			            }
			        }
			    },
				maintainAspectRatio: false
			},
			plugins: [{
				beforeInit: function(chart) {
					var chartData = chart.data.datasets[0].data
				}
			}]
		});
	}

	static getDerivedStateFromProps(props, state){
		return props
	}

	componentDidUpdate(){
		this.createChart()
	}

  	render(){
		return(
			<Grid item xs={12}>
				<canvas id="lineChart" ></canvas>
			</Grid>
		)
  	}
}

export default LineChart = withTheme(LineChart);

