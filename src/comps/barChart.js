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

import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import postData from "../utils/api"
import "../styles.css"


var db = firebase.database();


/*
Show details graphs and stuff of score data

// create a new view instance for a given Vega JSON spec
var view = new vega.View(vega.parse(spec), {renderer: 'none'});

// generate a static SVG image
view.toSVG()
  .then(function(svg) {
    // process svg string
  })
  .catch(function(err) { console.error(err); });

// generate a static PNG image
view.toCanvas()
  .then(function(canvas) {
    // process node-canvas instance
    // for example, generate a PNG stream to write
    var stream = canvas.createPNGStream();
  })
  .catch(function(err) { console.error(err); });
*/


class BarChart extends Component {
	constructor(props){
		super(props)
		this.state = {
			spec: this.generateSpec(props.values)
		}
	}

	generateSpec(values){
		return {
		  "$schema": "https://vega.github.io/schema/vega/v5.json",
		  "width": 400,
		  "height": 200,
		  "padding": 5,

		  "data": [
		    {
		      "name": "table",
		      "values": values
		    }
		  ],

		  "signals": [
		    {
		      "name": "tooltip",
		      "value": {},
		      "on": [
		        {"events": "rect:mouseover", "update": "datum"},
		        {"events": "rect:mouseout",  "update": "{}"}
		      ]
		    }
		  ],

		  "scales": [
		    {
		      "name": "xscale",
		      "type": "band",
		      "domain": {"data": "table", "field": "category"},
		      "range": "width",
		      "padding": 0.05,
		      "round": true
		    },
		    {
		      "name": "yscale",
		      "domain": {"data": "table", "field": "amount"},
		      "nice": true,
		      "range": "height"
		    }
		  ],

		  "axes": [
		    { "orient": "bottom", "scale": "xscale" },
		    { "orient": "left", "scale": "yscale" }
		  ],

		  "marks": [
		    {
		      "type": "rect",
		      "from": {"data":"table"},
		      "encode": {
		        "enter": {
		          "x": {"scale": "xscale", "field": "category"},
		          "width": {"scale": "xscale", "band": 1},
		          "y": {"scale": "yscale", "field": "amount"},
		          "y2": {"scale": "yscale", "value": 0}
		        },
		        "update": {
		          "fill": {"value": "steelblue"}
		        },
		        "hover": {
		          "fill": {"value": "red"}
		        }
		      }
		    },
		    {
		      "type": "text",
		      "encode": {
		        "enter": {
		          "align": {"value": "center"},
		          "baseline": {"value": "bottom"},
		          "fill": {"value": "#333"}
		        },
		        "update": {
		          "x": {"scale": "xscale", "signal": "tooltip.category", "band": 0.5},
		          "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -2},
		          "text": {"signal": "tooltip.amount"},
		          "fillOpacity": [
		            {"test": "isNaN(tooltip.amount)", "value": 0},
		            {"value": 1}
		          ]
		        }
		      }
		    }
		  ]
		}

	}

	
	componentDidMount(){
		  

    fetch('https://vega.github.io/vega/examples/bar-chart.vg.json')
      .then(res => res.json())
      .then(spec => this.renderSpec(spec))
      .catch(err => console.error(err));
	}

    renderSpec(spec) {
      let vega = window.VEGA
      let view = new vega.View(vega.parse(spec), {
        renderer:  'canvas',  // renderer (canvas or svg)
        container: '#barChart',   // parent DOM container
        hover:     true       // enable hover processing
      });
      return view.runAsync();
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

	return(
		<Grid item xs={12}>
		 	
			<Paper elevation={2}> 
				<div id="barChart" ></div>
			</Paper>
		</Grid>
	)
  }
}




  
export default BarChart = withTheme(BarChart);

