import React, { Component } from 'react'

import
{ 	Grid, Button, TextField, Select, TableHead, Typography,
	TableRow, TableBody, Table, Switch, TableContainer
}
from '@material-ui/core';
import {TableCell as TC} from '@material-ui/core';
import { withTheme, withStyles } from '@material-ui/core/styles';


const TableCell = withStyles({root:{
	borderBottom: "none"
}})(TC)

class AddGymClass extends Component {
  constructor(props){
    super(props)
    this.state = {
      userMD: props.userMD,
      userBoxes: props.userBoxes,
	  	box: {},  // stores selected box
	  	classInfo: {isPrivate: false, description: ""}, // stores current classInfo

    }
  }

  static getDerivedStateFromProps(props, state){
		return state
  }

  onKeyUp(data){
    if((data.keyCode || data.which) === 13){
      this.createGymClass()
    }
  }

  createGymClass(){
		this.props.addGymClass()

  }

  handleCheckboxChange(ev){
	  let { name, checked } = ev.target
	  this.props.onClassChange(name, checked)
  }

  onBoxChange(ev){
		const { value } = ev.target
		this.props.onBoxChange(parseInt(value))
  }

	onClassChange(ev){
		let { name, value } = ev.target // title or description
		this.props.onClassChange(name, value)
	}

  render () {
    return (
    	<Grid item xs={12}>
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
										name = "boxID"
										style={{width: "100%"}}
										value={this.props.addClassBoxIndex}
										onChange={this.onBoxChange.bind(this)}
									>
										{this.state.userBoxes.length > 0 ?
											this.state.userBoxes.map((box, i) => {
												return (<option key={i} value={i} >
																	{box["title"]}
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
									Title
								</Typography>
								</TableCell>
								<TableCell>
									<TextField
										name = "title"
										type="text"
										pattern="[\sA-Za-z0-9]{35}"
										onChange={this.onClassChange.bind(this)}
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
								<TableCell>
								<Typography color="primary" variant="subtitle1">
									Description
								</Typography>
								</TableCell>
								<TableCell>
									<TextField
										name="description"
										type="text"
										pattern="[\sA-Za-z0-9]{35}"
										onChange={ this.onClassChange.bind(this) }
										placeholder="Description"
										onKeyUp={ this.onKeyUp.bind(this) }
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
								<TableCell>
								<Typography color="primary" variant="subtitle1">
									Private
								</Typography>
								</TableCell>
								<TableCell>
								<Switch
									name="isPrivate" color="secondary"
									checked={this.state.isPrivate}
									onChange={this.handleCheckboxChange.bind(this)}
								/>
								</TableCell>
							</TableRow>
							<TableRow>
									<TableCell align="center" colSpan={2}>
										<Button size="small" variant="outlined" color="secondary"
												onClick={ () => { this.createGymClass()} } >
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

export default AddGymClass = withTheme(AddGymClass);