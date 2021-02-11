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

import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import BoxView from "./boxView" 
import BoxSearch from "./boxSearch" 
import { removeBox } from "../../utils/firestore/boxes"
import "../../styles.css"

var db = firebase.database();

class BoxListAccordion extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      userBoxes: props.userBoxes,
      hasBoxes: props.hasBoxes,
      currentBoxID: "",
      showRemoveAlert: false,
      curRemoveBoxID: "",
      curRemoveBoxTitle: ""
    }
  }

  componentWillReceiveProps(newProps){
    this.setState({...newProps})
  }

  componentWillUnmount(){
  	console.log("Component will unmount")
  }

  handleRemoveBox(boxID, boxTitle){
  	this.setState({
  		showRemoveAlert: true, 
  		curRemoveBoxID: boxID,
  		curRemoveBoxTitle: boxTitle
  	})
  }

  handleModalClose(){
  	this.setState({showRemoveAlert:false})
  }

  deleteBox(){  	
  	removeBox(this.state.curRemoveBoxID)
  	.then((res)=>{
  		let finished = (res.reduce((a,b) => a+b, 0) === 3) ? true: false

  		this.handleModalClose()
  	})
  	.catch((err)=>{console.log(err)})
  }

  render(){
	return(
	<Accordion id="BoxListAccordion">
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
			<Grid container  item={12}>
				{
					this.state.userBoxes.length > 0
				?
					<BoxSearch 
						user = {this.state.user}
						userMD = {this.state.userMD}
						allBoxes = {this.state.userBoxes}
						handleRemoveBox={this.handleRemoveBox.bind(this)}
						isOwner = {true}
					/>
				:
					<Grid item zeroMinWidth xs={6}>
						<Paper elevation={4} style={{padding: "1vw"}}>
							<Typography noWrap align="left">No boxes Found!</Typography>
						</Paper>
					</Grid>
				}
			</Grid>
		</AccordionDetails>
		<Modal
	        open={this.state.showRemoveAlert}
	        onClose={this.handleModalClose.bind(this)}
	        aria-labelledby="simple-modal-title"
	        aria-describedby="simple-modal-description"
	    >
	    	<div style={{
				position: 'absolute',
				top: "50%",
				left: "50%",
				width: "80vw",
			    transform: "translate(-50%, -50%)",
			}}>
				<Grid item align="center" xs={12}>
	    		<Paper style={{height:"25vh", display: "flex", flexDirection: "column",justifyContent: "center"}}>
	    			<Typography style={{position: ""}}>
	    				 Remove {this.state.curRemoveBoxTitle} ({this.state.curRemoveBoxID})
	    			</Typography>
	    			
	    			<Button color="primary" variant="outlined" onClick={()=>{ this.deleteBox()}}>Delete</Button>
	    		</Paper>
	    		</Grid>
	    	</div>
	    </Modal>
	</Accordion>		
	)
  }
}
  
export default BoxListAccordion = withTheme(BoxListAccordion);

