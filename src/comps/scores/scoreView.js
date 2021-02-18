import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/database"; 

import ReactMarkdown from 'react-markdown'

import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import 
{   Grid, Paper, Button, Typography, Collapse, TextField, Select,
  Accordion, AccordionSummary, AccordionDetails, FormControlLabel,
  CircularProgress, LinearProgress, CardActions, Card, CardContent,
  ListItem, List, ListItemText, TableRow, TableHead, TableContainer,
  TableCell, TableBody, Table, Modal
} 
from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import ScoreDataView from "./scoreDataView" 
import ScoreList from "./scoreList"
import AddScore from "./addScore" 
import ActionCancelModal from "../actionCancelModal"

import { removeScore } from "../../utils/firestore/scores"
import "../../styles.css"


var db = firebase.database();

class ScoreView extends Component {
  constructor(props){
    super(props)
    this.state = {
      userMD: props.userMD,
      boxID: props.boxID,
      wodID: props.wodID,
      wodMD: {},
      scores: [],
      userScore: {},
      curRemoveScoreID: "",
      showRemoveAlert: false
    }
  }

  componentDidMount(){
    let fs = firebase.firestore()
    this.wodListener = fs.collection("wods").doc(this.state.wodID)
    .onSnapshot(ss => {
      this.setState({wodMD: ss.data()})
    },
      err => {console.log(err)})

    this.scoreListener = fs.collection("scores")
    .where("wodID", "==", this.state.wodID)
    .onSnapshot(ss => {
      if(!ss.empty){
        let scores = []
        let userScore = {}
        let scoreType = ""
        ss.forEach(doc => {
          let data = doc.data()
          scores.push(data)
          scoreType = data.scoreType
          if(data.uid === this.state.uid)
            userScore = data
        })
        let isTime = (scoreType && scoreType === "time") ? 1 : 0
        scores.sort((a,b) => {
          return isTime 
          ?
              parseFloat(a["score"]) < parseFloat(b["score"]) ? -1 : 1
          :
             parseFloat(a["score"]) > parseFloat(b["score"]) ? 1 : -1
        })
        this.setState({
          scores: scores,
          userScore: userScore
        })
      }else{
        this.setState({
          scores: [],
          userScore: {}
        })
      }
    }, 
      err => {})
  }

  componentWillReceiveProps(newProps){
    this.setState({...newProps})
    console.log(newProps)
  }

  componentWillUnmount(){
    if(this.scoreListener !== undefined)
      this.scoreListener()
    if(this.wodListener !== undefined)
      this.wodListener()
  }

  handleModalClose(){
    this.setState({showRemoveAlert:false})
  }

  handleRemoveScore(scoreID){
    console.log(`Remove score with ID: ${scoreID}`)
    this.setState({curRemoveScoreID: scoreID, showRemoveAlert: true})
  }

  removeScore(){
    let scoreID = this.state.curRemoveScoreID
    if(scoreID === "" || scoreID.length <=0){return}

    this.setState({showRemoveAlert: false})

    removeScore(scoreID)
    .then((res)=>{
      console.log(res)
      this.setState({showRemoveAlert: false})     
    })
    .catch((err)=>{console.log(err)})
  }

  render(){
    console.log(this.state.userMD)
  return(
    <React.Fragment>
      {Object.keys(this.state.wodMD).length > 0 ?
        <Grid item xs={12}>
          <Grid item align="center" xs={12}>
            <Paper elevation={2}>
              <Typography>{this.state.wodMD["title"]}</Typography>
              <Typography>Type: {this.state.wodMD["scoreType"]}</Typography>
            </Paper>
          </Grid>

          <Grid item container xs={12}>
            <Paper elevation={2}>
              <ReactMarkdown>{this.state.wodMD["wodText"]}</ReactMarkdown>
            </Paper>   
          </Grid>
          {Object.keys(this.state.userMD).length > 0?
            <AddScore 
              userMD={this.state.userMD}
              wodMD={this.state.wodMD}
            />
          :
            <React.Fragment></React.Fragment>
          }
          <Grid item xs={12}>
            <Paper elevation={2}>   
              <ScoreDataView 
                scores={this.state.scores}
              />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={2}>   
            <ScoreList
              scores={this.state.scores}
              uid={this.state.userMD.uid}
              onRemove={this.handleRemoveScore.bind(this)}
            />
            </Paper>
          </Grid>
          <ActionCancelModal
            open={this.state.showRemoveAlert}
                onClose={this.handleModalClose.bind(this)}
                onAction={this.removeScore.bind(this)}
                modalText={`Remove score?`}
                actionText={`Remove`}
                cancelText={`Cancel`}
            />
          </Grid>
        :
          <React.Fragment>
            Wod not found!
          </React.Fragment>
      }
    </React.Fragment>
  )
  }
}
  
export default ScoreView = withTheme(ScoreView);


