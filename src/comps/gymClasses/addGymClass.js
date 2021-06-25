import React, { Component } from 'react'

import
{ 	Grid, Button, TextField, Select,
	TableRow, TableBody, Table, Checkbox
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
      hasBoxes: props.hasBoxes,
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
								value={this.props.addClassBoxIndex}
								onChange={this.onBoxChange.bind(this)}
							>
								{this.state.hasBoxes ?
									this.state.userBoxes.map((box, i) => {
										return (<option key={i} value={i} >
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
						<TableCell>Description</TableCell>
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