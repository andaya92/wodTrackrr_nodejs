import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/database";


import React, { Component } from 'react'

import
{ 	Grid, Paper, Button, Typography, TextField, Select,
	TableRow, TableHead, TableContainer,
	TableBody, Table, Checkbox
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
      userMD: props.userMD,
      userBoxes: props.userBoxes,
      hasBoxes: props.hasBoxes,
	  	box: props.userBoxes[0],
	  	classInfo: {
				boxID: props.userBoxes[0]['boxID'],
				isPrivate: false
			}
    }
  }

  static getDerivedStateFromProps(props, state){
	return {...props,  box: props.userBoxes[0]}
  }

  onKeyUp(data){
    if((data.keyCode || data.which) == 13){
      this.createGymClass()
    }
  }

  createGymClass(){
		let boxID = this.state.classInfo.boxID
		let owner = this.state.classInfo.owner
		let boxTitle = this.state.classInfo.boxTitle
		let title = this.state.classInfo.title
		let description = this.state.classInfo.description
		let isPrivate = this.state.classInfo.isPrivate

		if(!title || !boxID || isPrivate === null || isPrivate === undefined){
			console.log("Error adding class: ")
			console.log(title, this.props.userMD.uid, isPrivate, boxID)
			return
		}

		setGymClass(
			title, this.props.userMD.uid, boxID, boxTitle, isPrivate, owner,
			description
		)
		.then((res)=>{
			this.props.onAlert({
				type: "success",
				message: "Added class!"
			})
		})
		.catch((err)=>{
			this.props.onAlert({
				type: "error",
				message: err.message
			})
		})
  }

  handleCheckboxChange(ev){
	  let classInfo = this.state.classInfo
	  let name = ev.target.name
	  classInfo[name] = ev.target.checked
	  this.setState({classInfo: classInfo})
  }

  onChange(ev){
		let classInfo = this.state.classInfo
		let name = ev.target.name
		let value = ev.target.value

		if(name == "boxID"){
			let box = JSON.parse(value)
			classInfo['boxID'] = box.boxID
			classInfo['boxTitle'] = box.title
			classInfo['owner'] = box.uid
		}else{
			classInfo[name] = value
		}
		this.setState({classInfo: classInfo})
  }

  render () {
    return (
    	<Grid item xs={12}>
			<Table>
				<TableBody>
					<TableRow>
						<TableCell>
							Gym
						</TableCell>
						<TableCell>
							<Select native
								name = "boxID"
								style={{width: "100%"}}
								onChange={this.onChange.bind(this)}
							>
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
								name = "title"
								type="text"
								pattern="[\sA-Za-z0-9]{35}"
								onChange={this.onChange.bind(this)}
								placeholder="Name of class"
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
						<TableCell>Description</TableCell>
						<TableCell>
							<TextField
								name="description"
								type="text"
								pattern="[\sA-Za-z0-9]{35}"
								onChange={this.onChange.bind(this)}
								placeholder="Description"
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
						<TableCell>Private</TableCell>
						<TableCell>
						<Checkbox
							name="isPrivate"
							checked={this.state.isPrivate}
							onChange={this.handleCheckboxChange.bind(this)}
						/>
						</TableCell>
					</TableRow>
					<TableRow>
							<TableCell align="center" colSpan={2}>
								<Button size="small" variant="outlined" color="primary"
										onClick={ () => { this.createGymClass()} } >
									Submit
								</Button>
							</TableCell>
					</TableRow>
				</TableBody>
			</Table>
  		</Grid>
    )
  }
}

export default AddGymClass = withTheme(AddGymClass);