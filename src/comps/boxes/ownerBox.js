import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/database"; 


import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import 
{ 	Grid, Paper, Button, Typography, Collapse, TextField, Select,
	Accordion, AccordionSummary, AccordionDetails, FormControlLabel,
	CircularProgress, LinearProgress, TableRow, TableHead, TableContainer,
  TableCell, TableBody, Table
} 
from '@material-ui/core';

import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import BoxListAccordion from "./boxListAccordion"
import { setBox } from "../../utils/firestore/boxes"
import AddWod from "../wods/addWod"
import "../../styles.css"

let fs = firebase.firestore();

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
 
  static getDerivedStateFromProps(props, state){
	return props
		if(newProps.userMD.accountType === "owner"){
			this.listenForBoxes()
		}
  }

  componentWillUnmount(){
  	if(this.boxListener !== undefined){
    	this.boxListener()
  	}
  }

  listenForBoxes(){
		fs.collection("boxes").where("uid", "==", this.state.user.uid)
		.onSnapshot(ss => {
			let data = []
			ss.forEach(doc => {
				data.push(doc.data())
			})
			this.setState({
				hasBoxes: true, 
				userBoxes: data
			})  			
		},
		err => {
  		this.setState({
				hasBoxes: false, 
				userBoxes: []
			})  			
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
	  if(!title)
	  	return
		setBox(title, this.props.user.uid)
		.then(res => {console.log(res)})
		.catch(err => {console.log(err)})
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
    	<Grid item container xs={12} id="ownerBox" >
				<Grid item xs={12} md ={6}>
					<Accordion>
		        <AccordionSummary
		          expandIcon={<ExpandMoreIcon color="primary"/>}
		          aria-label="Expand"
		          aria-controls="additional-actions1-content"
		          id="additional-actions1-header"
		        >
		        	<Typography >
		        		Add Gym
		        	</Typography>	        
		        </AccordionSummary>
		        <AccordionDetails>
		        	<Grid container item xs={12}>
			        	<Grid item xs={12}>
			        		<TableContainer>
										<Table>
											<TableRow>
													<TableCell>Title</TableCell>
													<TableCell>
														<TextField
								              id="ownerBoxAddBoxTitle"
								              type="text"
								              pattern="[\sA-Za-z0-9]{35}"
								              inputProps={{
								                title: "Letters only, max length 35",
								                placeholder: "Name of gym"
								              }}
								              onKeyUp={this.onKeyUp.bind(this) }
								              margin="normal"
								              color="primary"
								              style={{width: "100%"}}
								              InputLabelProps={{
								                shrink: true,
								              }}
								            />
													</TableCell>
											</TableRow>
											<TableRow>
													<TableCell align="center" colSpan={2}>
														<Button size="small" variant="outlined" color="primary" 
										      		onClick={ () =>{
										      			let el = document.getElementById("ownerBoxAddBoxTitle")
										      			this.createBox(el.value)
										      		}
										      	}>
										      	Enter Title
										      </Button>
						      			</TableCell>
											</TableRow>
										</Table>
									</TableContainer>
								</Grid>
					    </Grid>
		        </AccordionDetails>
				  </Accordion>
				</Grid>			
				
				<Grid item xs={12} md={6}>
					<Accordion>
		        <AccordionSummary
		          expandIcon={<ExpandMoreIcon color="primary"/>}
		          aria-label="Expand"
		          aria-controls="additional-actions0-content"
		          id="additional-actions0-header"
		        >
		        	<Typography >
		        		Add wod
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
  		          <span>No Gyms</span>
  		      	}
		        </AccordionDetails>
				  </Accordion>
				</Grid>
				
				<Grid item xs={12}>
			  	<BoxListAccordion 
			  		user = {this.state.user}
						userMD = {this.state.userMD}
						userBoxes = {this.state.userBoxes}
						hasBoxes = {this.state.hasBoxes}
			  	/>
				</Grid>
  		</Grid>
    );
  }
}




export default OwnerBox = withTheme(OwnerBox);