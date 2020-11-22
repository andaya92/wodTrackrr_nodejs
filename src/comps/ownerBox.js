import firebase from "../context/firebaseContext"
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

import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';


import BoxListAccordion from "../comps/boxListAccordion"

import postData from "../utils/api"
import "../styles.css"


var db = firebase.database();



/*
Accordion for:
Add Box
Show Boxes


*/







class OwnerBox extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      userBoxes: new Array(),
      hasBoxes: false,
      addBoxProgress: true,
      scoreTypeSelectVal: "",
      boxIDSelectVal: ""
    }
  }
  

  getArrayOfBoxes(boxObj){
  	return Array.from(Object.entries(boxObj), entry => {
  		 return new Map(Object.entries(entry[1]));
  	})
  }

  listenForBoxes(){
  	if(this.state.user === null){return}
  	console.log("Listening for boxes")
  	// if listner has been set, dont reset it
  	let path = `users/${this.state.user.uid}/boxes`
  	
  	this.boxListener = db.ref(path).on('value', ss => {
  		if(ss != null && ss.exists()){
	  		console.log("Snapshot:")
	  		console.log(ss.val())
  			this.updateState({hasBoxes: true, userBoxes: this.getArrayOfBoxes(ss.val())})
  			

  		}
  	})
  }

  updateState(newState){
  	console.log("Seeting state")
  	console.log(newState)
  	this.setState({...newState})
  }

  componentDidMount(){
  	this.listenForBoxes()
  }

  componentWillReceiveProps(newProps){
    this.setState({...newProps})
    if(newProps.userMD.accountType === "owner"){
    	this.listenForBoxes()
    }
  }

  componentWillUnmount(){
  	console.log("Component will Unmounting")
  	if(this.boxListener !== undefined){
  		console.log("Unmounting OwnerBox")
    	this.boxListener()
  	}
  }

  onKeyUp(data){
    if((data.keyCode || data.which) == 13){
        let a = document.getElementById("ownerBoxAddBoxTitle")
        let title = a.value
        this.setState({showAddBoxProgress: true})
        this.createBox(title)
    }
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

  	let wodBoxPath = `wods/${boxID}`
	let wodID = db.ref(wodBoxPath).push().key
	let wodPath = `${wodBoxPath}/${wodID}`

	db.ref(wodPath).set({
		boxID: boxID,
		wodID: wodID,
		title: title,
		scoreType: scoreType,
		wodText: wodText
	})
  }

  createBox(title){
  	let boxNamesTitle = `boxNames/${title}`
  	let userBoxes = `users/${this.props.user.uid}/boxes`
  	let boxes = `boxes`

	db.ref(boxNamesTitle).once("value", ss =>{
		if(ss.exists()){
			alert("Title is taken")
		}else{
			console.log("Adding box data")
			let boxID = db.ref(boxes).push().key
			let boxData = {
				title: title,
				ownerUID: this.props.user.uid,
				boxID: boxID
			}

			// add to list of all boxes
			db.ref(`${boxes}/${boxID}`).set(boxData)
			// add to list of boxNames
			db.ref(boxNamesTitle).set(boxData)
			// add to users list of boxes
			db.ref(`${userBoxes}/${boxID}`).set(boxData)
			this.setState({showAddBoxProgress: false})
		}
	})
  }



  handleSelectValChange(ev){
	const name = ev.target.name;
	console.log(name)
    this.setState({
      [name]: ev.target.value
  	})
  }
 
  render () {
    return (
    	<Grid item xs={12} id="ownerBox">
			<Typography variant="h3">
				Welcome, {this.state.userMD.accountType}!
			</Typography>
	
			<Accordion>
	        <AccordionSummary
			  style={{background: this.props.theme.palette.primary.mainGrad}}
	          expandIcon={<ExpandMoreIcon />}
	          aria-label="Expand"
	          aria-controls="additional-actions0-content"
	          id="additional-actions0-header"
	        >
        	<Typography >
        		Add WOD
        	</Typography>	        
	        </AccordionSummary>
	        <AccordionDetails>
	          <Select
		          native
		          inputProps={{
		            name: 'Box',
		            id: 'ownerBoxAddWodBoxID',
		          }}>
		          <option aria-label="None" value="" />
		          {
		          	this.state.hasBoxes
		          	?
		          	this.state.userBoxes
	        		.map((box, i) => {
		        		return (<option key={i} value={box.get("boxID")} >{box.get("title")}</option>)
		        	})
		        	:
		        	<React.Fragment></React.Fragment>
		          }
		      </Select>
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
	              InputLabelProps={{
	                shrink: true,
	              }}
	            />
	            <Select
		          native
		          
		          inputProps={{
		            name: 'Score Type',
		            id: 'ownerBoxAddWodScoreType',
		          }}
		        >
		          <option aria-label="None" value="" />
		          <option value={"time"}>Time</option>
		          <option value={"reps"}>Reps</option>
		          <option value={"rounds"}>Rounds</option>
		      </Select>
		      <Button variant="outlined" onClick={this.createWOD.bind(this)}>
		      	Enter WOD
		      </Button>
	        </AccordionDetails>
		    </Accordion>


			<Accordion>
		        <AccordionSummary
				  style={{background: this.props.theme.palette.primary.mainGrad}}
		          expandIcon={<ExpandMoreIcon />}
		          aria-label="Expand"
		          aria-controls="additional-actions1-content"
		          id="additional-actions1-header"
		        >
		        	<Typography >
		        		Add Box
		        	</Typography>	        
		        </AccordionSummary>
		        <AccordionDetails>
		          <TextField
		              id="ownerBoxAddBoxTitle"
		              type="text"
		              style={{ margin: 8}}
		              pattern="[\sA-Za-z0-9]{35}"
		              inputProps={{
		                title: "Letters only, max length 35",
		                placeholder: "Name of box"
		              }}
		              onKeyUp={this.onKeyUp.bind(this) }
		              margin="normal"
		              color="primary"
		              InputLabelProps={{
		                shrink: true,
		              }}
		            />
		            {this.state.showAddBoxProgress
		            ?
		            	<LinearProgress  color="secondary"/>	
		            :
		            	<React.Fragment></React.Fragment>
		            }
		        </AccordionDetails>
		    </Accordion>

		  	<BoxListAccordion 
		  		user = {this.state.user}
				userMD = {this.state.userMD}
				userBoxes = {this.state.userBoxes}
				hasBoxes = {this.state.hasBoxes}
		  	/>
		  
    	
  		</Grid>
    );
  }
}




export default OwnerBox = withTheme(OwnerBox);