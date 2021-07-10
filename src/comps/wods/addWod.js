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
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell>
								<TextField select
									name='addWodBoxSelected'
									value={this.state.addWodBoxSelected}
									onChange={this.onChange.bind(this)}
									label="Gym"
									SelectProps={{
										native: true,
									}}
									style={{width: "100%"}}
								>
									{this.state.userBoxes.length > 0 ?
										this.state.userBoxes.map((box, i) => {
											return (
												<option key={i} value={i}>
													{box.title}
												</option>)
											})
									:
										<option aria-label="None" value="0" >No gyms</option>
									}
								</TextField>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<TextField select
									name='addWodGymClassSelected'
									value={this.state.addWodGymClassSelected}
									onChange={this.onChange.bind(this)}
									label="Class"
									SelectProps={{
										native: true,
									}}
									style={{width: "100%"}}
								>
									{this.state.gymClasses.length > 0 ?
										this.state.gymClasses.map((gymClass, i) => {
										return (<option key={i} value={i} >
															{gymClass["title"]}
														</option>)
									})
								:
									<option aria-label="None" value="0" >No Classes!</option>
								}
				      	</TextField>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<TextField select
									style={{width: "100%"}}
									onChange={this.onChange.bind(this)}
									value={this.state.addWodScoreTypeSelected}
									name='addWodScoreTypeSelected'
									label="Score Type"
									SelectProps={{
										native: true,
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
								</TextField>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<TextField
									name="addWodTitleForm"
									label="Title"
									type="text"
									color="primary"
									style={{width: "100%"}}
									pattern="[\sA-Za-z0-9]{35}"
									margin="normal"
								  onChange={this.onChange.bind(this)}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<TextField
									name="addWodWodTextForm"
									type="text"
									label="Enter workout"
									rows={12}
									multiline
									onChange={this.onChange.bind(this)}
									margin="normal"
									color="primary"
									style={{width: "100%"}}
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