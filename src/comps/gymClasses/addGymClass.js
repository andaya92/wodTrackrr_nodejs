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
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell>
									<TextField select
										name = "boxID"
										style={{width: "100%"}}
										value={this.props.addClassBoxIndex}
										label="Gym"
										onChange={this.onBoxChange.bind(this)}
										SelectProps={{
											native: true,
										}}
									>
										{this.state.userBoxes.length > 0 ?
											this.state.userBoxes.map((box, i) => {
												return (<option key={i} value={i} >
																	{box["title"]}
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
									<TextField
										name = "title"
										type="text"
										pattern="[\sA-Za-z0-9]{35}"
										onChange={this.onClassChange.bind(this)}
										label="Name of class"
										onKeyUp={this.onKeyUp.bind(this) }
										margin="normal"
										color="primary"
										style={{width: "100%"}}
									/>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<TextField
										name="description"
										type="text"
										pattern="[\sA-Za-z0-9]{35}"
										onChange={ this.onClassChange.bind(this) }
										label="Description"
										onKeyUp={ this.onKeyUp.bind(this) }
										margin="normal"
										color="primary"
										style={{width: "100%"}}
									/>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<Grid container justify="center" direction="column">
										<Grid item >
											<Typography variant="caption">Private</Typography>
										</Grid>
										<Grid item>
											<Switch
												name="isPrivate" color="secondary"
												label="Private"
												checked={this.state.isPrivate}
												onChange={this.handleCheckboxChange.bind(this)}
											/>
										</Grid>
									</Grid>
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