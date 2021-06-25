import React, { Component } from 'react'

import{ 	Grid, Typography, TextField,
	TableRow, Button, TableContainer,
	TableBody, Table, TableCell
}from '@material-ui/core';
import { withTheme, withStyles } from '@material-ui/core/styles';

import { setScore } from "../../utils/firestore/scores"
import "../../styles.css"

const BorderlessTableCell = withStyles({root:{
	borderBottom: "none"
}})(TableCell)

class AddScore extends Component{
	constructor(props){
		super(props)
		this.state = {
			userMD: props.userMD,
			wodMD: props.wodMD,
			showingAddScore: false
		}
	}

	static getDerivedStateFromProps(props, state){
		return props
	}

	objListToArray(obj){
		// let key = Object.keys(obj)[0]
		return Array.from(Object.entries(obj), entry => {
			 return new Map(Object.entries(entry[1]));
		})
	}

	isNumInSane(s){
		let hasNonDigitRegex = /\D/
		let res = s.search(hasNonDigitRegex)
		let isSane = (res === -1) ? true: false
		return isSane
	}

	handleAddScore(){
		if(!this.state.userMD){return}

		let userScore = ""
		if(this.state.wodMD['scoreType'] === "time"){
			let mins =  document.getElementById("scoreViewUserScoreMins").value
			let secs =  document.getElementById("scoreViewUserScoreSecs").value
			if(!this.isNumInSane(mins) || !this.isNumInSane(secs)){
				alert(`Time must only contain numbers, entered: ${mins}:${secs}`)
				return
			}
			if(parseInt(secs) > 59){
				alert(`Seconds must be 59 or below, entered: ${secs}`)
				return
			}
			if(parseInt(secs) < 10 && secs.length === 1){
				secs = `0${secs}`
			}
			if(isNaN(parseInt(secs)) ||  isNaN(parseInt(mins))){
				alert(`Missing field, entered: ${mins}:${secs}`)
				return
			}
			if(mins.length > 2){
				alert(`Minutes must be 99 or below, entered: ${mins}`)
				return
			}
			if(mins.length === 0){
				mins = "0"
			}
			if(secs.length === 0){
				secs = "0"
			}
			userScore = `${mins}:${secs}`
		}else{
			// reps or rounds
			userScore =  document.getElementById("scoreViewUserScore").value
			if(userScore.length > 3){
				alert(`Score must be 3 digits or less, entered: ${userScore}`)
				return
			}
			if(!userScore){
				alert("Must enter score.")
				return
			}
			if(!this.isNumInSane(userScore)){
				alert(`Score must be digits only, entered: ${userScore}`)
				return
			}
		}

		let username = this.state.userMD.username
		let uid = this.state.userMD.uid
		let wodID = this.state.wodMD["wodID"]
		let owner = this.state.wodMD["owner"]
		let gymClassID = this.state.wodMD["gymClassID"]
		let boxID = this.state.wodMD["boxID"]
		let title = this.state.wodMD["title"]
		let scoreType = this.state.wodMD["scoreType"]

		if(!title || !boxID || !gymClassID || !wodID || !owner || !uid || !username || !userScore || !scoreType){
			console.log("Score info not found: ")
			console.log(title, boxID, gymClassID, wodID, owner, uid, username, userScore, scoreType)
		}

		setScore(title, boxID, gymClassID, wodID, owner, uid, username, userScore, scoreType)
		.then((res) => {
			console.log(res)
			// Toggles back button to close addScore
			if(this.props.onClose){
				this.props.onClose()
			}
		})
		.catch((err) => {
			console.log(err)
			this.props.onAlert({
				type: "error",
				message: "Failed to add score."
			})
		})
	}



  	render(){
	return(
		<Grid item xs={12} style={{margin: "0px 0px 8px 0px"}}>

				<Grid item container xs={12}>
					<Grid item xs={12}>
						<Typography>
							{this.state.wodMD['scoreType']
								.replace(
									this.state.wodMD['scoreType'][0],
									this.state.wodMD['scoreType'][0].toUpperCase())
							}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<TableContainer>
						<Table>
						<TableBody>
							<TableRow>
								{this.state.wodMD.scoreType === "time" ?
									<React.Fragment>
									<BorderlessTableCell align="center">
										<TextField
											id="scoreViewUserScoreMins"
											type="number"
											style={{ margin: 8, width: "100%"}}
											pattern="[0-9]{3}"
											inputProps={{
												title: "Numbers only, max length 3",
												placeholder: "Minutes"
											}}
											margin="normal"
											color="primary"
											InputLabelProps={{
												shrink: true,
											}}
											/>
									</BorderlessTableCell>
									<BorderlessTableCell align="center">
										<TextField
											id="scoreViewUserScoreSecs"
											type="number"
											style={{ margin: 8, width: "100%"}}
											pattern="[0-9]{2}"
											inputProps={{
												title: "Numbers only, max length 2",
												placeholder: "Seconds"
											}}
											margin="normal"
											color="primary"
											InputLabelProps={{
												shrink: true,
											}}
										/>
									</BorderlessTableCell>
									</React.Fragment>
								:
									<BorderlessTableCell align="center" colSpan={2}>
										<TextField
											id="scoreViewUserScore"
											type="number"
											style={{ margin: 8, width: "100%"}}
											pattern="[0-9]{4}"
											inputProps={{
												title: "Numbers only, max length 4",
												placeholder: "Score"
											}}
											margin="normal"
											color="primary"
											InputLabelProps={{
												shrink: true,
											}}
										/>
									</BorderlessTableCell>
								}
							</TableRow>
							<TableRow>
								<BorderlessTableCell colSpan={3} align="center">
									<Button  color="primary" style={{width: "100%"}} variant="outlined"
										onClick={this.handleAddScore.bind(this)}>
										Add
									</Button>
								</BorderlessTableCell>
							</TableRow>
					</TableBody>
					</Table>
					</TableContainer>
				</Grid>
			</Grid>
		</Grid>
		)
  }
}


export default AddScore = withTheme(AddScore);

