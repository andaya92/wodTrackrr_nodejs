import firebase from "../../context/firebaseContext"
import "firebase/firestore"


import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import 
{ 	Grid, Paper, Button, Typography, Collapse, TextField, Select,
	Accordion, AccordionSummary, AccordionDetails, FormControlLabel,
	CircularProgress, LinearProgress, TableRow, TableHead, TableContainer,
  	TableBody, Table
} 
from '@material-ui/core';
import {TableCell as TC} from '@material-ui/core';

import { withTheme, withStyles } from '@material-ui/core/styles'

import Workout from "./workout"
import WorkoutPreview from "./workoutPreview"
import { setWod } from "../../utils/firestore/wods"
import { getGymClasses } from "../../utils/firestore/gymClass"


let fs = firebase.firestore()

const TableCell = withStyles({root:{
	borderBottom: "none"
}})(TC)

export default class AddWod extends Component {
	constructor(props){
		super(props)
		this.state = {
			user: props.user,
			userMD: props.userMD,
			userBoxes: props.userBoxes,
			hasBoxes: props.hasBoxes,
			gymClasses: [],
			submit: false,
			rows: []
		}
	}

	componentWillReceiveProps(newProps){
		this.setState({...newProps})
		if(newProps.userBoxes)
			this.setGymClassListner(newProps.userBoxes[0].boxID)
	}

	setGymClassListner(boxID){
		console.log("Getting snapshot for", boxID)
		getGymClasses(boxID)
		.onSnapshot(ss => {
			if(!ss.empty){
				let classes = []
				ss.forEach(doc => {
					classes.push(doc.data())
					console.log(doc.data())
				})
				this.setState({gymClasses: classes})
			}else{
				this.setState({gymClasses: []})
			}
		},
		err => {console.log(err)})
	}

	onBoxSelectChange(ev){
		let boxID = ev.target.value
		this.setGymClassListner(boxID)
	}

	getWorkoutData(rows){
		console.log("Create Wod with this data")
		console.log(rows)
	}

	onSubmit(){
		this.setState({submit: true})
	}

	onWorkoutUpdate(rows){
		this.setState({rows: rows})
	}


	createWOD(){
	  	let boxID = document.getElementById("ownerBoxAddWodBoxID").value
	  	let gymClassID = JSON.parse(document.getElementById("AddWodGymClassID").value).gymClassID
	  	let title = document.getElementById("ownerBoxAddWodTitle").value
	  	let scoreType = document.getElementById("ownerBoxAddWodScoreType").value
	  	let wodText = document.getElementById("ownerBoxAddWodWodText").value

	  	if(!boxID || !gymClassID || !title || !scoreType || !wodText){
	  		console.log("Error with input createWod")
	  		console.log(boxID, gymClassID, title, scoreType, wodText)
	  		return
	  	}

	  	setWod(boxID, gymClassID, title, wodText, scoreType)
	  	.then(()=> {console.log("Successfully added wod.")})
	  	.catch((err)=>{console.log(err)})

	  }


	render(){
		return(
			<Grid item container xs={12}>
				<TableContainer>
					<Table>
					<TableHead>
						<TableRow>
							<TableCell>
							</TableCell>
							<TableCell>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell>
								<Typography color="primary" variant="caption">
									Box
								</Typography>
							</TableCell>
							<TableCell>
								<Select native
									style={{width: "100%"}}
									onChange={this.onBoxSelectChange.bind(this)}
									inputProps={{
										name: 'Box',
										id: 'ownerBoxAddWodBoxID'}}>
						          	{this.state.hasBoxes ?
							          	this.state.userBoxes.map((box, i) => {
						        			return (<option key={i} value={box["boxID"]} >
						        								{box["title"]}
						        							</option>)
						        		})
						        	:
						        		<option aria-label="None" value="" >No boxes!</option>
						          }
				      			</Select>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<Typography color="primary" variant="caption">
									Class
								</Typography>
							</TableCell>
							<TableCell>
								<Select native
									style={{width: "100%"}}
									inputProps={{
										name: 'gymClass',
										id: 'AddWodGymClassID'}}>
						          	{this.state.gymClasses.length > 0 ?
							          	this.state.gymClasses.map((gymClass, i) => {
						        			return (<option key={i} value={JSON.stringify(gymClass)} >
						        								{gymClass["title"]}
						        							</option>)
						        		})
						        	:
						        		<option aria-label="None" value="" >No Classes!</option>
						          }
				      			</Select>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<Typography color="primary" variant="caption">
									Score Type
								</Typography>
							</TableCell>
							<TableCell>
								<Select native 
									style={{width: "100%"}}
									inputProps={{
										name: 'Score Type',
										id: 'ownerBoxAddWodScoreType',
									}}>
						      <option value={"time"}>Time</option>
						      <option value={"reps"}>Reps</option>
								</Select>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<Typography color="primary" variant="caption">
									Title
								</Typography>
							</TableCell>
							<TableCell>
								<TextField
					              id="ownerBoxAddWodTitle"
					              type="text"
					              style={{width: "100%"}}
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
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell colSpan={2} align="center">
								<Typography color="primary" variant="caption">
									Workout
								</Typography>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell colSpan={2}>
								<WorkoutPreview 
									rows={this.state.rows}/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell colSpan={2}>
								<Workout submit={this.state.submit}
									onSubmit={this.getWorkoutData.bind(this)}
									onUpdate={this.onWorkoutUpdate.bind(this)}
								/>
							</TableCell>
						</TableRow>
					</TableBody>
					</Table>
				</TableContainer>
				<Grid item xs={12}>
				    <Button 
				      	variant="outlined" 
				      	color="primary" 
				      	onClick={this.onSubmit.bind(this)}>
				      	Enter WOD
				    </Button>
		      	</Grid>
			</Grid>
		)
	}
}