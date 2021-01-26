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

import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';


import BoxListAccordion from "./boxListAccordion"

import {setBox, setWod, removeWod} from "../../utils/firebaseData"
import AddWod from "../wods/addWod"

import postData from "../../utils/api"
import "../../styles.css"


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
      userBoxes: [],
      hasBoxes: false,
      addBoxProgress: true,
      scoreTypeSelectVal: "",
      boxIDSelectVal: ""
    }
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
  	if(this.boxListener !== undefined){
    	this.boxListener()
  	}
  }


  getArrayOfBoxes(boxObj){
	return Array.from(Object.entries(boxObj), entry => {
		 return new Map(Object.entries(entry[1]));
	})
  }

  listenForBoxes(){
  	if(this.state.user.uid === null){return}
  	let path = `users/${this.state.user.uid}/boxes`
  	
  	this.boxListener = db.ref(path).on('value', ss => {
  		if(ss != null && ss.exists()){
			this.setState({
				hasBoxes: true, 
				userBoxes: this.getArrayOfBoxes(ss.val())
			})  			
  		}else{
  			this.setState({
				hasBoxes: false, 
				userBoxes: []
			})
  		}
  	})
  }
  

  onKeyUp(data){
    if((data.keyCode || data.which) == 13){
        let a = document.getElementById("ownerBoxAddBoxTitle")
        let title = a.value
        this.setState({showAddBoxProgress: true})
        this.createBox(title)
    }
  }

  // import setBox from ""
  createBox(title){
	setBox(title, this.props.user.uid)
	.then((res) => {console.log(res)})
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
    	<Grid item xs={12} id="ownerBox" >
			<Typography variant="h3">
				Welcome, {this.state.userMD.accountType}!
			</Typography>
			
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
		        </AccordionDetails>
		    </Accordion>
	
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
		        {this.state.hasBoxes ?
		          	<AddWod
  		          	uid={this.state.user.uid}
  		          	userMD={this.state.userMD}
  		          	userBoxes={this.state.userBoxes}
  		          	hasBoxes={this.state.hasBoxes}
  		          />
  		          :
  		          <span>No boxes</span>
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