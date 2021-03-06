import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/database";

import ReactMarkdown from 'react-markdown'

import React, { Component } from 'react'
import { Route, Link, Redirect } from 'react-router-dom';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import
{ 	Grid, Paper, Button, Typography, Collapse, TextField, Select,
	Accordion, AccordionSummary, AccordionDetails, FormControlLabel,
	CircularProgress, LinearProgress, CardActions, Card, CardContent,
	ListItem, List, ListItemText, TableRow, TableHead, TableContainer,
	TableCell, TableBody, Table, Modal
}
from '@material-ui/core';
import { Delete, LooksOneOutlined, AddBoxOutlined } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import ActionCancelModal from "../actionCancelModal"
import { removeScore } from "../../utils/firestore/scores"
import "../../styles.css"


var db = firebase.database();

class UserScoreList extends Component {
	constructor(props){
		super(props)
		this.state = {
			scores: props.scores,
			uid: props.uid,
			showRemoveAlert: false,
			removeScoreID: "",
			redirectUrl: "",
			redirect: false
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
				message: err
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
		this.setState({redirectUrl: url, redirect: true})
	}

  	render(){
		return(
			<React.Fragment>
			{this.state.scores.length > 0?
			<TableContainer component={Paper}>
				{this.state.redirect?
					<Redirect to={this.state.redirectUrl} />
				:
					<React.Fragment></React.Fragment>
				}
				<Table aria-label="score table">
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
			</TableContainer>
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


export default UserScoreList = withTheme(UserScoreList);

function ScoreRow(props){
	let score = props.info["score"]
	let title = props.info["title"]
	let wodID = props.info["wodID"]
	let uid = props.info["uid"]
	let scoreID = props.info["scoreID"]
	let boxID = props.info["boxID"]
	return(
		<TableRow onClick={(ev) => {
			let tagName = ev.target.tagName
			if(["path", "svg"].indexOf(tagName) > -1)
				return
			props.onView(`wod/${boxID}/${wodID}`)
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
