import React, { Component } from 'react'

import 
{ 	Grid, Paper, Button, Typography, TextField, Select,
	CardActions, Card, CardContent, TableRow, TableHead, TableContainer,
	TableCell, TableBody, Table, Modal
} 
from '@material-ui/core';
import { Alert } from '@material-ui/lab'
import { withTheme } from '@material-ui/core/styles'
import Delete from '@material-ui/icons/Delete'



import "../../styles.css"

class ScoreList extends Component {
	constructor(props){
		super(props)
		this.state = {
			scores: props.scores,
			uid: props.uid
		}
	}

	static getDerivedStateFromProps(props, state){
		return props
	}
	
  render(){
		return(
			<React.Fragment>
			{this.state.scores.length > 0?
			<TableContainer component={Paper}>
				<Table aria-label="score table">
				<TableHead>
					<TableRow>
						<TableCell>Username</TableCell>
						<TableCell>Score</TableCell>
						<TableCell></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{
					this.state.scores.map((score, i) => {
						let isCurUserScore = 
							(this.state.uid == score["uid"])? true : false
						return <ScoreRow key={i}
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
function ScoreRowRaw(props){
	let score = props.info["score"]
	let username = props.info["username"]
	let wodID = props.info["wodID"]
	let uid = props.info["uid"]
	let scoreID = props.info["scoreID"]
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
			  		<TableCell align="right">
					    <Button size="small" 
					    	
					    	onClick={() => props.onRemove(scoreID)}>
					    	<Delete color="error"  />
					    </Button>
			  		</TableCell>
			  		:
			  		<TableCell></TableCell>

		  		}
		</TableRow>
	)
}
let ScoreRow =  withTheme(ScoreRowRaw)