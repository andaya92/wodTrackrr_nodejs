import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/database"; 

import ReactMarkdown from 'react-markdown'

import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import 
{ 	Grid, Paper, Button, Typography, Collapse, TextField, Select,
	Accordion, AccordionSummary, AccordionDetails, FormControlLabel,
	CircularProgress, LinearProgress, CardActions, Card, CardContent,
	ListItem, List, ListItemText, TableRow, TableHead, TableContainer,
	TableCell, TableBody, Table, Modal
} 
from '@material-ui/core';

import { DeleteOutlined, LooksOneOutlined, AddBoxOutlined } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import ActionCancelModal from "../actionCancelModal"
import { removeScore } from "../../utils/firebase/scores"
import "../../styles.css"


var db = firebase.database();

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
    removeScore(this.state.removeScoreID)
    .then((res)=>{
      this.hideRemoveAlert()
    })
    .catch((err)=>{console.log(err)})
	}

	hideRemoveAlert(){
		this.setState({showRemoveAlert: false})
	}

	componentWillReceiveProps(newProps){
		this.setState({...newProps})
	}
	
  	render(){
		return(
			<React.Fragment>
			{this.state.scores.length > 0?
			<TableContainer component={Paper}>
				<Table aria-label="score table">
				<TableHead>
					<TableCell>Username</TableCell>
					<TableCell>Score</TableCell>
					<TableCell>Box</TableCell>
					<TableCell>Wod</TableCell>
					<TableCell>Remove</TableCell>
				</TableHead>
				<TableBody>
					{
					this.state.scores.map(score => {
						return <ScoreRow 
							info={score}
							onViewBox={this.handleViewBox.bind(this)}
							onViewWod={this.handleViewWod.bind(this)}
							onRemove = {this.showRemoveAlert.bind(this)}
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

/*
Show details of Box and its WODS
*/
function ScoreRow(props){
	let score = props.info["score"]
	let username = props.info["username"]
	let wodID = props.info["wodID"]
	let uid = props.info["uid"]
	let scoreID = props.info["scoreID"]
	let boxID = props.info["boxID"]
	return(
		<TableRow>
				<TableCell>
					{username}
				</TableCell>
				<TableCell>
					{score} 
				</TableCell>
				<TableCell>
			    <Link to={`box/${boxID}`}>
			    	<AddBoxOutlined />
			    </Link>
	  		</TableCell>
	  		<TableCell>
			    <Link to={`wod/${boxID}/${wodID}`}>
			    	<LooksOneOutlined />
			    </Link>
	  		</TableCell>
	  		<TableCell>
			    <Button size="small"
			    	color="error" 
			    	onClick={() => props.onRemove(scoreID)}>
			    	<DeleteOutlined />
			    </Button>
	  		</TableCell>
		</TableRow>
	)
}
