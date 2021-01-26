import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/database"; 


import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import 
{ 	Grid, Paper, Button, Typography, Collapse, TextField, Select,
	Accordion, AccordionSummary, AccordionDetails, FormControlLabel,
	CircularProgress, LinearProgress
} 
from '@material-ui/core';

import {setWod} from "../../utils/firebaseData"


var db = firebase.database();

export default class AddWod extends Component {
	constructor(props){
		super(props)
		this.state = {
			userBoxes: props.userBoxes,
			hasBoxes: props.hasBoxes
		}
	}


	componentWillReceiveProps(newProps){
		this.setState({...newProps})
	}

	createWOD(){
	  	let boxID = document.getElementById("ownerBoxAddWodBoxID").value
	  	let title = document.getElementById("ownerBoxAddWodTitle").value
	  	let scoreType = document.getElementById("ownerBoxAddWodScoreType").value
	  	let wodText = document.getElementById("ownerBoxAddWodWodText").value

	  	if(!boxID || !title || !scoreType || !wodText){
	  		console.log("Error with input createWod")
	  		console.log(boxID, title, scoreType, wodText)
	  		return
	  	}

	  	setWod(boxID, title, wodText, scoreType)
	  	.then((res)=> {console.log(res)})
	  	.catch((err)=>{console.log(err)})

	  }


	render(){
		return(
			<Grid item container xs={12}>
				<Grid item xs={6}>
				    <Select
			          native
			          inputProps={{
			            name: 'Box',
			            id: 'ownerBoxAddWodBoxID',
			          }}
			        >
			          { this.state.hasBoxes ?
			          	this.state.userBoxes
		        		.map((box, i) => {
			        		return (<option key={i} value={box.get("boxID")} >{box.get("title")}</option>)
			        	})
			        	:
			        	<option aria-label="None" value="" >No boxes!</option>
			          }
			      </Select>
			    </Grid>
			    <Grid item xs={6}>
					<Select
					  native
					  
					  inputProps={{
					    name: 'Score Type',
					    id: 'ownerBoxAddWodScoreType',
					  }}
					>
					      <option value={"time"}>Time</option>
					      <option value={"reps"}>Reps</option>
					  </Select>
			    </Grid>
			    <Grid item xs={12}>
		          <TextField
		              id="ownerBoxAddWodTitle"
		              type="text"
		              style={{ margin: 8}}
		              pattern="[\sA-Za-z0-9]{35}"
		              inputProps={{
		                title: "Letters only, max length 35",
		                placeholder: "Title"
		              }}
		              margin="normal"
		              color="primary"
		              InputLabelProps={{
		                shrink: true,
		              }}
		            />
		        </Grid>
		        <Grid item xs={12}>
		             <TextField
		              id="ownerBoxAddWodWodText"
		              type="text"
		              style={{ margin: 8}}
		              pattern="[\sA-Za-z0-9]{35}"
		              inputProps={{
		                title: "Letters only, max length 35",
		                placeholder: "Workout here"
		              }}
		              margin="normal"
		              color="primary"
		              multiline
  					  rows={10}
		              InputLabelProps={{
		                shrink: true,
		              }}
		            />
		        </Grid>
		        
			      <Grid item xs={12}>
				      <Button 
				      	variant="outlined" 
				      	color="primary" 
				      	onClick={this.createWOD.bind(this)}
				      >
				      	Enter WOD
				      </Button>
			      </Grid>
			</Grid>
		)
	}
}