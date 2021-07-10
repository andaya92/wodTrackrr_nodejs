import React, { Component } from 'react'

import{
	Grid, Button, Typography, TextField, Select,
  TableRow, TableHead, TableContainer, TableBody, Table
}from '@material-ui/core';
import {TableCell as TC} from '@material-ui/core';

import { withTheme, withStyles } from '@material-ui/core/styles'

import { setWod } from "../../utils/firestore/wods"

const SCORETYPES = ["reps", "rounds", "time", "total"]

const TableCell = withStyles({root:{
	borderBottom: "none"
}})(TC)

class AddWodClass extends Component {
	constructor(props){
		super(props)
		this.state = {
            gymClassMD: props.gymClassMD,
			titleForm: "",
			scoreTypeForm: SCORETYPES[0],
			wodTextForm: ""
		}
	}

	static getDerivedStateFromProps(props, state){
		return props
	}







	onTitleChange(ev){
		console.log(ev.target.value)
		let title = ev.target.value
		this.setState({titleForm: title})
	}

	onScoreTypeSelectChange(ev){
		console.log(ev.target.value)
		let scoreType = ev.target.value
		this.setState({scoreTypeForm: scoreType})
	}

	onWodTextChange(ev){

		let wodText = ev.target.value
		this.setState({wodTextForm: wodText})
	}

	createWOD(){
	  	let boxID = this.state.gymClassMD.boxID
		let owner = this.state.gymClassMD.owner
		let boxTitle = this.state.gymClassMD.boxTitle
	  	let gymClassID = this.state.gymClassMD.gymClassID
		let classTitle = this.state.gymClassMD.title
		let isPrivate = this.state.gymClassMD.isPrivate
	  	let title = this.state.titleForm
	  	let scoreType = this.state.scoreTypeForm
	  	let wodText = this.state.wodTextForm

	  	if(!boxID || !gymClassID || !scoreType || !wodText || !owner){
			this.props.onAlert({
				type: "error",
				message: "Error creating workout"
			})
	  		console.log(boxID, gymClassID, title, scoreType, wodText, owner)
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
			<Grid item container xs={12} align="center">
				<TableContainer>
					<Table>
					<TableHead>
						<TableRow>
							<TableCell colSpan={2} align="center">
									Add Workout
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell>
								<TextField select
									name="Score Type"
									label="Score Type"
									onChange={this.onScoreTypeSelectChange.bind(this)}
									SelectProps={{
										native: true,
									}}
									style={{width: "100%"}}
									>
										{
											SCORETYPES.map((scoreType, i) => {
												return <option key={i} value={scoreType}>
													{ scoreType.replace(
																scoreType[0],
																scoreType[0].toUpperCase()) }
												</option>
											})
										}
								</TextField>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<TextField
									id="ownerBoxAddWodTitle"
									type="text"
								  onChange={this.onTitleChange.bind(this)}
									style={{width: "100%"}}
									pattern="[\sA-Za-z0-9]{35}"
									label="Title"
									margin="normal"
									color="primary"
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
							<TextField
								id="wodText"
								type="text"
								style={{width: "100%"}}
								onChange={this.onWodTextChange.bind(this)}
								label="Workout"
								margin="normal"
								color="primary"
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

export default AddWodClass = withTheme(AddWodClass)