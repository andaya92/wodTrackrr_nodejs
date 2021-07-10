import React, { Component } from 'react'

import{
	Grid, Paper, Button, Typography,  TextField, Modal
}
from '@material-ui/core';

import { editWod } from "../../utils/firestore/wods"

import { withTheme, withStyles } from '@material-ui/core/styles';

const StyledGrid = withStyles((theme) => ({
	root: {
		marginTop: "2.5vh",
		marginBottom: "2.5vh"
	},
}))(Grid);


class EditWod extends Component {
	constructor(props){
		super(props)
		this.state = {
			open: props.open,
			wodInfo: props.wodInfo,
			userBoxes: props.userBoxes,
			onClose: props.onClose
		}
	}

	static getDerivedStateFromProps(props, state){
		return props
	}

	editWOD(){
		this.props.onClose()
		let boxID = this.state.wodInfo.boxID
		let gymClassID = this.state.wodInfo.gymClassID
		let wodID = this.state.wodInfo.wodID
		let title = this.state.wodInfo.title
		let wodText = this.state.wodInfo.wodText

		if(!boxID || !gymClassID || !wodID || !title || !wodText){
			console.log("Missing edit wod info: ")
			console.log(boxID, gymClassID, wodID, title, wodText)
			return
		}

	  	editWod(boxID, gymClassID, wodID, title, wodText)
	  	.then((res)=> {
			this.props.onAlert({
			type: "success",
			message: res
		})
	  	})
	  	.catch((err)=>{
			this.props.onAlert({
				type: "error",
				message: err.message
			})
		})
	  }

	handleValChange(ev){
	    let wodInfo = this.state.wodInfo
		const {name, value} = ev.target
		wodInfo[name] = value
		this.setState({
	      wodInfo: wodInfo
	  	})
	}


	render(){
		return(
			<Modal
			    open={this.state.open}
			    onClose={this.props.onClose}
			    aria-labelledby="edit-wod-modal"
			    aria-describedby="edit-wod">
				<div style={{
					position: 'absolute',
					top: "50%",
					left: "50%",
					width: "80vw",
				    transform: "translate(-50%, -50%)",
				}}>
					<Grid
						item
						align="center"
						xs={12}>
						<Paper style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
							<Typography variant="h6">
								Edit Wod ({this.state.wodInfo["wodID"]})
							</Typography>
							<StyledGrid item xs={12}>
								<TextField
									type="text"
									name="title"
									style={{ margin: 8}}
									value= {this.state.wodInfo['title']}
									onChange={this.handleValChange.bind(this)}
									pattern="[\sA-Za-z0-9]{35}"
									label="Title"
									margin="normal"
									color="primary"
									/>
							</StyledGrid>
							<StyledGrid item xs={12}>
								<TextField
								type="text"
								name="wodText"
								style={{ margin: 8}}
								value= {this.state.wodInfo['wodText']}
								onChange={this.handleValChange.bind(this)}
								pattern="[\sA-Za-z0-9]{35}"
								label="Workout here"
								margin="normal"
								color="primary"
								multiline
								rows={5}
								/>
							</StyledGrid>

						<StyledGrid container item xs={12}>
							<Grid item xs={6}>
								<Button
									variant="outlined"
									color="primary"
									onClick={this.props.onClose}>
									Cancel
								</Button>
							</Grid>
							<Grid item xs={6}>
								<Button
									variant="outlined"
									color="primary"
									onClick={this.editWOD.bind(this)}>
									Update
								</Button>
							</Grid>
						</StyledGrid>
					</Paper>
					</Grid>
				</div>
			</Modal>
		)
	}
}

export default EditWod = withTheme(EditWod);