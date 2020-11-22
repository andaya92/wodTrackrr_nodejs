import firebase from "../context/firebaseContext"
import "firebase/auth";
import "firebase/database"; 


import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import 
{ 	Grid, Paper, Button, Typography, Collapse, TextField, Select,
	Accordion, AccordionSummary, AccordionDetails, FormControlLabel,
	CircularProgress, LinearProgress, CardActions, Card, CardContent
} 
from '@material-ui/core';

import ScoreView from "../comps/scoreView"

import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import postData from "../utils/api"
import "../styles.css"


var db = firebase.database();


/*
Show details of Box and its WODS
*/
function Wod(props){
	let title = props.info.get("title")
	let scoreType = props.info.get("scoreType")
	let wodText = props.info.get("wodText")
	
	return(
		<Grid item xs={4}>
		<Card variant="outlined" color="primary">
		  <CardContent>
		    <Typography variant="h5" component="h2"gutterBottom>
		      {title}
		    </Typography>
		    <Typography color="textSecondary" >
		      {scoreType}
		    </Typography>
		    <Typography color="textSecondary">
		      {wodText}
		    </Typography>
		  </CardContent>
		  <CardActions>
		    <Button size="small" color="primary" onClick={() => props.handleScoreView(props.info)}>View Scores</Button>
		  </CardActions>
		</Card>
		</Grid>
	)
}

class BoxView extends Component {
	constructor(props){
		super(props)
		this.state = {
		  userMD: props.userMD,
		  boxID: props.boxID,
		  boxMD: new Map(),
		  wods: new Array(),
		  showWodList: true,
		  currentWodID: "",
		  currentWodMD: new Map()
		}
	}


	componentDidMount(){
		let boxPath = `boxes/${this.props.boxID}`
		let wodPath = `wods/${this.props.boxID}`
		this.boxListener  = db.ref(boxPath).on("value", ss => {
			if(ss && ss.exists()){
				this.setState({boxMD: new Map(Object.entries(ss.val()))})
			}
		})
		this.wodListener  = db.ref(wodPath).on("value", ss => {
			if(ss && ss.exists()){
				this.setState({wods: this.objListToArray(ss.val())})
			}
		})
	}

	componentWillReceiveProps(newProps){
		this.setState({...newProps})
	}

	componentWillUnmount(){
		console.log("Component will unmount")
		this.wodListener()
		this.boxListener()
	}

	objListToArray(obj){
		return Array.from(Object.entries(obj), entry => {
			 return new Map(Object.entries(entry[1]));
		})
	}

	handleScoreView(wodMD){
		this.setState({showWodList: false, currentWodMD: wodMD})
	}

	handleBack(){
		this.setState({showWodList: true})
	}



  render(){
	return(
		<Grid item xs={12}>
		<Paper elevation={2}>
			<Typography align="center" variant="h3">{this.state.boxMD.get("title")}</Typography>


			{this.state.showWodList
			?
				<React.Fragment>
					<Typography variant="h4">Wods</Typography>
					<Grid container item xs={12}>
					{this.state.wods.length > 0
					?
						this.state.wods.map(wod => {
							return <Wod handleScoreView={this.handleScoreView.bind(this)} info={wod} />
						})
					:
						<Grid item xs={12}>
							<Card variant="outlined" color="primary">
							  <CardContent>
							    <Typography variant="h5" component="h2"gutterBottom>
							   	No Wods!
							    </Typography>
							   </CardContent>
							</Card>
						</Grid>
					}
					</Grid>
				</React.Fragment>
			:
				<ScoreView 
					userMD={this.state.userMD}
					wodMD={this.state.currentWodMD} 
					handleBack={this.handleBack.bind(this)}/>

			}
		</Paper>



		<Grid item xs={12}>
			<Button variant="outlined" color="secondary" onClick={()=>{this.props.handleBack()}}>Back</Button>
		</Grid>
		</Grid>
	)
  }
}




  
export default BoxView = withTheme(BoxView);

