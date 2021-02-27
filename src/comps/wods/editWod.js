import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/database"; 


import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import 
{ 	Grid, Paper, Button, Typography, Collapse, TextField, Select,
	Accordion, AccordionSummary, AccordionDetails, FormControlLabel,
	CircularProgress, LinearProgress, Modal
} 
from '@material-ui/core';

import {editWod} from "../../utils/firestore/wods"


var db = firebase.database();

export default class EditWod extends Component {
	constructor(props){
		super(props)
		this.state = {
			wodInfo: props.wodInfo,
			userBoxes: props.userBoxes,
			hasBoxes: props.hasBoxes,
			open: props.open,
			onClose: props.onClose,
			title: props.title,
			wodText: props.wodText
		}
	}

	static getDerivedStateFromProps(props, state){
		return props
	}
	
	editWOD(){
	  	let boxID = document.getElementById("editOwnerBoxAddWodBoxID").value
	  	let title = document.getElementById("editOwnerBoxAddWodTitle").value
	  	let scoreType = document.getElementById("editOwnerBoxAddWodScoreType").value
	  	let wodText = document.getElementById("editOwnerBoxAddWodWodText").value
	  	let wodID = this.state.wodInfo["wodID"]

	  	if(!boxID || !title || !scoreType || !wodText || !wodID){
	  		console.log("Error with input editWod")
	  		console.log(boxID, title, scoreType, wodText)
	  		return
	  	}
	  	editWod(boxID, wodID, title, wodText, scoreType)
	  	.then((res)=> {
	  		console.log(res)
	  		this.props.onClose()
	  	})
	  	.catch((err)=>{console.log(err)})
	  }

	handleValChange(ev, val){
		const name = ev.target.name;
		console.log(name, val)
	    this.setState({
	      [name]: ev.target.value
	  	})
	}

	render(){
		let oldScoreType = this.state.wodInfo["scoreType"]
		let scoreTypes = ["time", "reps"]
		let oldBoxID = this.state.wodInfo["boxID"]
		return(

			<Modal
			    open={this.state.open}
			    onClose={this.props.onClose}
			    aria-labelledby="edit-wod-modal"
			    aria-describedby="edit-wod">
				<div style={{
					position: 'absolute',
					top: "50%",
					left: "50%",
					width: "80vw",
				    transform: "translate(-50%, -50%)",
				}}>
					<Grid 
						item 
						align="center" 
						xs={12}
					>
					<Paper style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
		    			<Typography style={{position: ""}}>
		    				 Edit Wod({this.state.wodInfo["wodID"]})
		    			</Typography>

		    			<Grid item container xs={12}>
						<Grid item xs={6}>
						    <Select
					          native
							  value={oldBoxID}
					          inputProps={{
					            name: 'Box',
					            id: 'editOwnerBoxAddWodBoxID',
					          }}
					        >
					          { this.state.hasBoxes ?
					          	this.state.userBoxes.map((box, i) => {
						        		let boxID = box["boxID"]
						        		return (
						        			<option key={i} value={boxID}>
					        					{box["title"]}
					        				</option>
						        		)
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
							    id: 'editOwnerBoxAddWodScoreType',
							  }}
							  value={oldScoreType}
							>
								{
									scoreTypes.map((scoreType, i) => {
										return (
											<option key={i} value={scoreType}>
										  	{scoreType}
										  </option>
										)
									})
								}
							</Select>
					    </Grid>
					    <Grid item xs={12}>
			          <TextField
			              id="editOwnerBoxAddWodTitle"
			              type="text"
			              name="title"
			              style={{ margin: 8}}
			              value= {this.state.title}
			              onChange={this.handleValChange.bind(this)}
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
		              id="editOwnerBoxAddWodWodText"
		              type="text"
		              name="wodText"
		              style={{ margin: 8}}
		              value= {this.state.wodText}
		              onChange={this.handleValChange.bind(this)}
		              pattern="[\sA-Za-z0-9]{35}"
		              inputProps={{
		                title: "Letters only, max length 35",
		                placeholder: "Workout here"
		              }}
		              margin="normal"
		              color="primary"
		              multiline
				  		  	rows={5}
		              InputLabelProps={{
		                shrink: true,
		              }}
	            	/>
			      	</Grid>
				      <Grid item xs={12}>
					      <Button 
					      	variant="outlined" 
					      	color="primary" 
					      	onClick={this.editWOD.bind(this)}
					      >
					      	Update
					      </Button>
				      </Grid>
				      <Grid item xs={12}>
					      <Button 
					      	variant="outlined" 
					      	color="primary" 
					      	onClick={this.props.onClose}
					      >
					      	Cancel
					      </Button>
				      </Grid>
						</Grid>
					</Paper>
					</Grid>
				</div>
			</Modal>
		)
	}
}