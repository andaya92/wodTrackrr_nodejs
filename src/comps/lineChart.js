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

import postData from "../utils/api"
import "../styles.css"


var db = firebase.database();


class LineChart extends Component {
	constructor(props){
		super(props)
		this.state = {
			dataType: props.dataType,
			data: props.data, // x y values for chart
			values: props.values, // raw score values
			stats: new Map() // mean, median, SD
		}
	}

	
	componentDidMount(){

	}

	createChart(){
		this.ctx = document.getElementById('lineChart');
		console.log(this.state.data)
		this.barChart = new Chart(this.ctx, {
		    type: 'line',
		    
		    data:  {
			    datasets: [{
			    	'label': "Score",
			        barPercentage: 0.5,
			        barThickness: 6,
			        maxBarThickness: 8,
			        minBarLength: 2,
			        backgroundColor: this.props.theme.palette.primary.main,
			        data: this.state.data
			    }]
			},
			options:{
				scales: {
		            yAxes: [{
		                ticks:{
		                	callback: function(label, index, labels) {
			                	return cvtIntToTime(label)
			                }
			             }
		            }]
			    },
			    tooltips: {
			        callbacks: {
			            label: function(tooltipItem, data) {
			                var label = data.datasets[tooltipItem.datasetIndex].label || '';

			                if (label) {
			                    label += ': ';
			                }
			                label += cvtIntToTime(tooltipItem.yLabel)
			                
			                return label;
			            }
			        }
			    },
				maintainAspectRatio: false
			},
			plugins: [{
				beforeInit: function(chart) {
					var chartData = chart.data.datasets[0].data
					console.log(chart.options.scales.yAxes)

				}
			}]
		});


	}
    

	componentWillReceiveProps(newProps){
		this.setState({...newProps}, ()=>{
			this.createChart()
		})
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

	return(
		<Grid item xs={12}>
		 	
			<Paper elevation={2}> 
				<canvas id="lineChart" width="400" height="400"></canvas>
			</Paper>
		</Grid>
	)
  }
}




  
export default LineChart = withTheme(LineChart);

