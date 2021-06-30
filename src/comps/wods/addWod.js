import React, { Component } from 'react'

import
{ 	Grid, Button, Typography, TextField, Select, TableRow,
	 TableHead, TableContainer, TableBody, Table
}
from '@material-ui/core';
import {TableCell as TC} from '@material-ui/core';

import { withTheme, withStyles } from '@material-ui/core/styles'





const TableCell = withStyles({root:{
	borderBottom: "none"
}})(TC)

class AddWod extends Component {
	constructor(props){
		super(props)
		this.state = {
			userBoxes: props.userBoxes,
			gymClasses: props.gymClasses,
			addWodScoreTypes: props.addWodScoreTypes,
			boxSelected: props.addWodBoxSelected,
			addWodGymClassSelected: props.addWodGymClassSelected,
			addWodScoreTypeSelected: props.addWodScoreTypeSelected,
			addWodTitleForm: props.addWodTitleForm,
			addWodWodTextForm: props.addWodWodTextForm
		}
	}

	static getDerivedStateFromProps(props, state){
		return props
	}

	onChange(ev){
		const { name, value } = ev.target
		const names = ["addWodTitleForm", "addWodWodTextForm"]

		if(names.indexOf(name) >= 0){
			this.props.addWodOnChange(name, value)
		}else{
			this.props.addWodOnChange(name, parseInt(value))
		}
	}

	createWOD(){
		this.props.createWOD()
	}

	render(){
		return(
			<Grid item container xs={12}>
				<TableContainer>
					<Table>
					<TableHead>
						<TableRow>
							<TableCell></TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell>
								<Typography color="primary" variant="subtitle1">
									Gym
								</Typography>
							</TableCell>
							<TableCell>
								<Select native
									style={{width: "100%"}}
									onChange={this.onChange.bind(this)}
									value={this.state.addWodBoxSelected}
									inputProps={{
										name: 'addWodBoxSelected'
									}}
								>
									{this.state.userBoxes.length > 0 ?
										this.state.userBoxes.map((box, i) => {
											return (
												<option key={i} value={i}>
													{box.title}
												</option>)
											})
									:
										<option aria-label="None" value="" >No gyms</option>
									}
								</Select>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<Typography color="primary" variant="subtitle1">
									Class
								</Typography>
							</TableCell>
							<TableCell>
								<Select native
									style={{width: "100%"}}
									onChange={this.onChange.bind(this)}
									value={this.state.addWodGymClassSelected}
									inputProps={{
										name: 'addWodGymClassSelected'
									}}
								>
									{this.state.gymClasses.length > 0 ?
										this.state.gymClasses.map((gymClass, i) => {
										return (<option key={i} value={i} >
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
								<Typography color="primary" variant="subtitle1">
									Score Type
								</Typography>
							</TableCell>
							<TableCell>
								<Select native
									style={{width: "100%"}}
									onChange={this.onChange.bind(this)}
									value={this.state.addWodScoreTypeSelected}
									inputProps={{
										name: 'addWodScoreTypeSelected'
									}}
								>
									{
										this.state.addWodScoreTypes.map((scoreType, i) => {
											return <option key={i} value={i}>
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
								<Typography color="primary" variant="subtitle1">
									Title
								</Typography>
							</TableCell>
							<TableCell>
								<TextField
								  onChange={this.onChange.bind(this)}
									inputProps={{
										name: "addWodTitleForm",
										title: "Letters only, max length 35",
										placeholder: "Title"
									}}
									type="text"
									style={{width: "100%"}}
									pattern="[\sA-Za-z0-9]{35}"
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
								<Typography color="primary" variant="subtitle1">
									Workout
								</Typography>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell colSpan={2}>
							<TextField
								onChange={this.onChange.bind(this)}
								inputProps={{
									name: "addWodWodTextForm",
									title: "Enter workout",
									placeholder: "workout"
								}}
								type="text"
								style={{width: "100%"}}
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
								color="secondary"
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