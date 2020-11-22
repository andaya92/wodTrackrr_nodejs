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

import BoxView from "../comps/boxView" 

import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import postData from "../utils/api"
import "../styles.css"


var db = firebase.database();


/*
Accordion to toggle between list of boxes and the box view component
**box view compnent will be sued in search as well


*/


class BoxListAccordion extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      userBoxes: props.userBoxes,
      hasBoxes: props.hasBoxes,
      showBoxList: true,
      currentBoxID: ""
    }
  }


  componentDidMount(){
  
  }

  componentWillReceiveProps(newProps){
    this.setState({...newProps})
  }

  componentWillUnmount(){
  	console.log("Component will unmount")
  }

  handleBoxView(boxID){
  	console.log("Show boxView for: ", boxID)

  	this.setState({showBoxList: false, currentBoxID: boxID})
  }

  handleBack(){
  	this.setState({showBoxList: true})
  }

  render(){
	return(
	<Accordion>
		<AccordionSummary
		style={{background: this.props.theme.palette.primary.main}}
		expandIcon={<ExpandMoreIcon />}
		aria-label="Expand"
		aria-controls="additional-actions2-content"
		id="additional-actions2-header"
		>
			<Typography >
			Boxes and Wods
			</Typography>	        
		</AccordionSummary>
		<AccordionDetails>
		{this.state.showBoxList
		?
			<Grid container >
				<Grid container  item={12}>
				{this.state.userBoxes.length > 0
				?
					this.state.userBoxes
					.map((box, i) => {
					return (<Box key={i} handleBoxView={this.handleBoxView.bind(this)} info={box} />)
					})
				:
				<Grid item zeroMinWidth xs={6}>
					<Paper elevation={4} style={{padding: "1vw"}}>
						<Typography noWrap align="left">No boxes Found!</Typography>
					</Paper>
				</Grid>
				}
				</Grid>
			</Grid>
		:
			<BoxView handleBack={this.handleBack.bind(this)} boxID={this.state.currentBoxID} />

		}

		
		</AccordionDetails>
	</Accordion>		
	)
  }
}


function Box(props){
	console.log(props.info.get("title"))
	let title = props.info.get("title")
	let boxID = props.info.get("boxID")
	return(
	<Grid item zeroMinWidth xs={6}>
	<Paper elevation={4} style={{padding: "1vw"}}>
		<Typography noWrap align="left">Title: {title}</Typography>
		<Typography  noWrap align="left">Id: {boxID}</Typography>
		<Button variant="outlined" color="primary" onClick={()=>{props.handleBoxView(boxID)}}>View</Button>
	</Paper>
	</Grid>)
}

  
export default BoxListAccordion = withTheme(BoxListAccordion);

