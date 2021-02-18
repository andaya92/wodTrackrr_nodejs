import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/database"; 


import React, { Component } from 'react'

import 
{ 	Grid, Paper, Button, Typography, TextField, Select,
	TableRow, TableHead, TableContainer,
	TableBody, Table
} 
from '@material-ui/core';
import {TableCell as TC} from '@material-ui/core';
import { withTheme, withStyles } from '@material-ui/core/styles';

import { setGymClass } from "../../utils/firestore/gymClass"

let fs = firebase.firestore();

const TableCell = withStyles({root:{
	borderBottom: "none"
}})(TC)

class AddGymClass extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      userBoxes: props.userBoxes,
      hasBoxes: props.hasBoxes
    }
  }
 
  componentDidMount(){
  }


  componentWillReceiveProps(newProps){
	this.setState({...newProps})
  }

  onKeyUp(data){
    if((data.keyCode || data.which) == 13){
      this.createGymClass()
    }
  }

  createGymClass(){
	let title = document.getElementById("addGymClassTitle").value
	let box = JSON.parse(document.getElementById("addGymClassBox").value)
	console.log(box)

	if(!title || !box)
		return

	setGymClass(title, this.props.user.uid, box.boxID, box.title)
	.then(res => {console.log(res)})
	.catch(err => {console.log(err)})
  }

  render () {
    return (
    	<Grid item xs={12}>
				<Table>
					<TableRow>
						<TableCell>
							Gym
						</TableCell>
						<TableCell>
							<Select native
								style={{width: "100%"}}
								inputProps={{
									name: 'Box',
									id: 'addGymClassBox'
								}}>
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
						<TableCell>Title</TableCell>
						<TableCell>
							<TextField
				              id="addGymClassTitle"
				              type="text"
				              pattern="[\sA-Za-z0-9]{35}"
				              inputProps={{
				                title: "Letters only, max length 35",
				                placeholder: "Name of class"
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
				      		onClick={ this.createGymClass.bind(this)} >
				      	Submit
				      </Button>
      			</TableCell>
					</TableRow>
				</Table>
  		</Grid>
    );
  }
}

export default AddGymClass = withTheme(AddGymClass);