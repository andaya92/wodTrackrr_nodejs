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

import { setBox } from "../../utils/firestore/boxes"

let fs = firebase.firestore();

const TableCell = withStyles({root:{
	borderBottom: "none"
}})(TC)

class AddBox extends Component {
  constructor(props){
    super(props)
    this.state = {
      userMD: props.userMD
    }
  }

  componentDidMount(){
  }

  static getDerivedStateFromProps(props, state){
	return props
  }

  onKeyUp(data){
    if((data.keyCode || data.which) == 13){
      let a = document.getElementById("ownerBoxAddBoxTitle")
      let title = a.value
      this.createBox(title)
    }
  }

  createBox(title){
	  if(!title)
	  	return
	setBox(title, this.props.userMD.uid)
	.then((res)=>{
		this.props.onAlert({
			type: "success",
			message: "Added gym!"
		})
	})
	.catch((err)=>{
	  this.props.onAlert({
		  type: "error",
		  message: err
	  })
	})
  }

  render () {
    return (
    	<Grid item xs={12}>
			<Table>
				<TableBody>
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
								Submit
							</Button>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
  		</Grid>
    );
  }
}

export default AddBox = withTheme(AddBox);