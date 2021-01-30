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
import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';


import "../../styles.css"


var db = firebase.database();

class ScoreList extends Component {
	constructor(props){
		super(props)
		this.state = {
			scores: props.scores,
			uid: props.uid
		}
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
					<TableCell></TableCell>
				</TableHead>
				<TableBody>
					{
					this.state.scores.map(score => {
						let isCurUserScore = 
							(this.state.uid == score.get("uid"))? true : false
						return <ScoreRow 
							info={score}
							onRemove = {this.props.onRemove}
							isUserScore={isCurUserScore} 
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
			</React.Fragment>
		)
	}
}

  
export default ScoreList = withTheme(ScoreList);

/*
Show details of Box and its WODS
*/
function ScoreRow(props){
	let score = props.info.get("score")
	let username = props.info.get("username")
	let wodID = props.info.get("wodID")
	let uid = props.info.get("uid")
	let scoreID = `${wodID}/${uid}`
	let rowStyle = (props.isUserScore)? "": ""
	return(
		<TableRow selected={props.isUserScore}>
				<TableCell>
					{username}
				</TableCell>
				<TableCell>
					{score} 
				</TableCell>
				{
		  			props.isUserScore
		  			?
			  		<TableCell>
					    <Button size="small" 
					    	color="error" 
					    	onClick={() => props.onRemove(scoreID)}>
					    	Remove
					    </Button>
			  		</TableCell>
			  		:
			  		<TableCell></TableCell>

		  		}
		</TableRow>
	)
}
