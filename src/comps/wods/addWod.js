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

import { setWod } from "../../utils/firestore/wods"
import { getGymClasses } from "../../utils/firestore/gymClass"

let fs = firebase.firestore()
const SCORETYPES = ["reps", "rounds", "time", "total"]

const TableCell = withStyles({root:{
	borderBottom: "none"
}})(TC)

class AddWod extends Component {
	constructor(props){
		super(props)
		this.state = {
			userBoxes: props.userBoxes,
			hasBoxes: props.hasBoxes,
			gymClasses: [],
			box: props.userBoxes[0],
			gymClass: {},
			titleForm: "",
			scoreTypeForm: SCORETYPES[0],
			wodTextForm: ""
		}
	}

	static getDerivedStateFromProps(props, state){
		return {...props,  box: props.userBoxes[0]}
	}

	componentDidUpdate(){
		if(!this.gymClassListener && this.state.userBoxes && this.state.userBoxes.length > 0){
			this.setGymClassListner(this.state.userBoxes[0].boxID)
		}
	}

	setGymClassListner(boxID){
		this.gymClassListener = getGymClasses(boxID)
		.onSnapshot(ss => {
			if(!ss.empty){
				let classes = []
				ss.forEach(doc => {
					classes.push(doc.data())
				})
				let initClass = classes[0]
				this.setState({
					gymClasses: classes,
					gymClass: initClass
				})

			}else{
				this.setState({gymClasses: []})
			}
		},
		err => {console.log(err)})
	}

	componentWillUnmount(){
		if(this.gymClassListener){
			this.gymClassListener()
		}
	}

	onBoxSelectChange(ev){
		let box = JSON.parse(ev.target.value)
		if(this.gymClassListener){
			this.gymClassListener()
		}
		this.setGymClassListner(box.boxID)
		this.setState({box: box})
	}

	onClassSelectChange(ev){
		let gymClass = JSON.parse(ev.target.value)
		this.setState({gymClass: gymClass})
	}

	onTitleChange(ev){
		let title = ev.target.value
		this.setState({titleForm: title})
	}

	onScoreTypeSelectChange(ev){
		let scoreType = ev.target.value
		this.setState({scoreTypeForm: scoreType})
	}

	onWodTextChange(ev){

		let wodText = ev.target.value
		this.setState({wodTextForm: wodText})
	}

	createWOD(){

		if(!this.state.box || !this.state.gymClass)
			return

	  	let boxID = this.state.box.boxID
		let owner = this.state.box.uid
		let boxTitle = this.state.box.title
	  	let gymClassID = this.state.gymClass.gymClassID
		let isPrivate = this.state.gymClass.isPrivate

		let classTitle = this.state.gymClass.title
	  	let title = this.state.titleForm
	  	let scoreType = this.state.scoreTypeForm
	  	let wodText = this.state.wodTextForm

	  	if(!boxID || !gymClassID || !title || !scoreType || !wodText || !owner || !classTitle || isPrivate === undefined){
	  		console.log("Error with input createWod")
	  		console.log(boxID, gymClassID, title, scoreType, wodText, owner, classTitle, isPrivate)
	  		return

	  	}

		setWod(title, boxID, gymClassID, owner, boxTitle, classTitle, scoreType, wodText, isPrivate)
	  	.then((res)=>{
			this.props.onAlert({
				type: "success",
				message: "Added workout!"
			})
		})
		.catch((err)=>{
		  this.props.onAlert({
			  type: "error",
			  message: err.message
		  })
	 	 })

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
						        			return (<option key={i} value={JSON.stringify(box)} >
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
									onChange={this.onClassSelectChange.bind(this)}
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
									onChange={this.onScoreTypeSelectChange.bind(this)}
									inputProps={{
										name: 'Score Type',
										id: 'ownerBoxAddWodScoreType',
									}}>
										{
											SCORETYPES.map((scoreType, i) => {
												return <option key={i} value={scoreType}>
													{ scoreType.replace(
																scoreType[0],
																scoreType[0].toUpperCase()) }
												</option>
											})
										}
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
								  onChange={this.onTitleChange.bind(this)}
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
							<TextField
					              id="wodText"
					              type="text"
					              style={{width: "100%"}}
								  onChange={this.onWodTextChange.bind(this)}
					              inputProps={{
					                title: "Enter workout",
					                placeholder: "workout"
					              }}
					              margin="normal"
					              color="primary"
					              InputLabelProps={{
					                shrink: true,
					              }}
								  multiline={true}
								  rows={12}
					            />
							</TableCell>
						</TableRow>
						<TableRow>
						<TableCell colSpan={2} align="center">
							<Button
								variant="outlined"
								color="primary"
								size="small"
								onClick={this.createWOD.bind(this)}>
								Submit
							</Button>
						</TableCell>
					</TableRow>
					</TableBody>
					</Table>
				</TableContainer>
			</Grid>
		)
	}
}

export default AddWod = withTheme(AddWod)