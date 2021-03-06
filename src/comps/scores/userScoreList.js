import React, { Component } from 'react'
import { withRouter } from "react-router-dom";

import{
	Grid, Button, Typography, Card, CardContent,
	TableRow, TableHead,TableCell, TableBody, Table
}from '@material-ui/core';
import { Delete } from '@material-ui/icons'
import { withTheme } from '@material-ui/core/styles';

import ActionCancelModal from "../actionCancelModal"
import { removeScore } from "../../utils/firestore/scores"
import "../../styles.css"

class UserScoreList extends Component {
	constructor(props){
		super(props)
		this.state = {
			scores: props.scores,
			uid: props.uid,
			showRemoveAlert: false,
			removeScoreID: ""
		}
	}

	handleViewWod(wodID){
		console.log(`Go to wodID: ${wodID}`)
	}

	handleViewBox(boxID){
		console.log(`Go to boxID: ${boxID}`)
	}

	showRemoveAlert(scoreID){
		this.setState({showRemoveAlert: true, removeScoreID: scoreID})
	}

	onRemove(){
		this.hideRemoveAlert()
		removeScore(this.state.removeScoreID)
		.then((res) => {
            this.props.onAlert({
				type: "success",
				message: res
			})
        })
        .catch(err => {
            this.props.onAlert({
				type: "error",
				message: err.message
			})
        })
	}

	hideRemoveAlert(){
		this.setState({showRemoveAlert: false})
	}

	static getDerivedStateFromProps(props, state){
		return props
	}

	onView(url){
		this.props.history.push(url)
	}

  	render(){
		return(
			<React.Fragment>
			{this.state.scores.length > 0?
			<Table size="small" aria-label="score table">
			<TableHead>
				<TableRow>
					<TableCell>Title</TableCell>
					<TableCell>Score</TableCell>
					<TableCell></TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{
				this.state.scores.map((score, i) => {
					return <ScoreRow key={i}
						info={score}
						onViewBox={this.handleViewBox.bind(this)}
						onViewWod={this.handleViewWod.bind(this)}
						onRemove = {this.showRemoveAlert.bind(this)}
						onView={this.onView.bind(this)}
					/>
				})
				}
			</TableBody>
			</Table>
			:
			<Grid item xs={12}>
				<Card variant="outlined" color="primary">
				  <CardContent>
				    <Typography variant="h5" component="h2"gutterBottom>
				   	No Scores!
				    </Typography>
				   </CardContent>
				</Card>
			</Grid>
			}
			<ActionCancelModal
				open={this.state.showRemoveAlert}
				actionText="Remove"
				cancelText="Cancel"
				modalText="Remove score?"
				onAction={this.onRemove.bind(this)}
				onClose={this.hideRemoveAlert.bind(this)}
			/>
			</React.Fragment>
		)
	}
}


export default UserScoreList = withRouter(withTheme(UserScoreList))

function ScoreRow(props){
	let score = props.info["score"]
	let title = props.info["title"]
	let scoreID = props.info["scoreID"]
	let wodID = props.info["wodID"]
	let gymClassID = props.info["gymClassID"]
	let boxID = props.info["boxID"]

	return(
		<TableRow onClick={(ev) => {
			let tagName = ev.target.tagName
			if(["path", "svg"].indexOf(tagName) > -1)
				return
			props.onView(`wod/${boxID}/${gymClassID}/${wodID}`)
		}}>
			<TableCell>
				{title}
			</TableCell>
			<TableCell>
				{score}
			</TableCell>
			<TableCell align="right">
				<Button size="small"
			    	onClick={() => props.onRemove(scoreID)}>
			    	<Delete color="error" />
			    </Button>
	  		</TableCell>
		</TableRow>
	)
}
