import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/database";

import ReactMarkdown from 'react-markdown'

import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import
{   Grid, Paper, Button, Typography
}
from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import { DateTime } from 'luxon'

import ScoreDataView from "./scoreDataView"
import ScoreList from "./scoreList"
import AddScore from "./addScore"
import ActionCancelModal from "../actionCancelModal"
import BackButton  from "../backButton"

import { getWodScores, removeScore } from "../../utils/firestore/scores"
import { getWod } from "../../utils/firestore/wods"
import { isEmpty } from "../../utils/valid"

import "../../styles.css"


var db = firebase.database();

function RenderWodTextRaw(props){
  let lines = props.wodText.split("\n")
  return(
    <Grid item xs={12}>
      {
        lines.map((line, i) => {
          return(
            <Grid item xs={12} key={i}>
              <Typography>
                {line? line: <br/>}
              </Typography>
            </Grid>
          )
        })
      }
    </Grid>
  )
}

const RenderWodText = withTheme(RenderWodTextRaw)

class ScoreView extends Component {
  constructor(props){
    super(props)
    this.state = {
      userMD: props.userMD,
      boxID: props.boxID,
      gymClassID: props.gymClassID,
      wodID: props.wodID,
      wodMD: {},
      scores: [],
      userScore: {},
      curRemoveScore: {},
      showRemoveAlert: false
    }
  }

  componentDidMount(){


    let fs = firebase.firestore()

    this.wodListener = getWod(this.state.boxID, this.state.gymClassID, this.state.wodID)
    .onSnapshot(ss => {
      this.setState({wodMD: ss.data()})
    },
      err => {console.log(err)})

      console.log("PreTest")
    this.scoreListener = getWodScores(this.state.boxID, this.state.gymClassID, this.state.wodID)
    .onSnapshot(ss => {
      console.log(ss)
      console.log("Test")
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
      err => { console.log(err)})
  }


  getWodListener(){
    let fs = firebase.firestore()

    this.wodListener = getWod(this.state.wodMD.boxID, this.state.gymClassID, this.state.wodID)
    .onSnapshot(ss => {
      this.setState({wodMD: ss.data()})
    },
      err => {console.log(err)})

  }

  static getDerivedStateFromProps(props, state){
    return props
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

  handleRemoveScore(score){
    this.setState({curRemoveScore: score, showRemoveAlert: true})
  }

  removeScore(){
    let score = this.state.curRemoveScore

    if(isEmpty(score)){
      this.props.onAlert({
        type: "error",
        message: "Invalid score"
      })
      return
    }

    this.setState({showRemoveAlert: false})
    removeScore( score.boxID, score.gymClassID, score.wodID, score.uid, score.scoreID)
    .then((res)=>{
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

  render(){

   let date = this.state.wodMD && this.state.wodMD.date?  DateTime.fromMillis(this.state.wodMD.date) : {monthLong: "", day: "", year:""}


  return(
    <Grid  item xs={12}>
      <BackButton />
      {Object.keys(this.state.wodMD).length > 0 ?
        <Grid item xs={12}>
          <Grid item align="center" xs={12}>
            <Paper elevation={6}>
            <Typography>{this.state.wodMD["boxTitle"]}</Typography>
            <Typography>{this.state.wodMD["gymClassTitle"]}</Typography>
              <Typography>{this.state.wodMD["title"]}</Typography>
              <Typography
                variant="subtitle1"
                color="primary">
                  For {this.state.wodMD["scoreType"]}
              </Typography>
              <Typography
                variant="caption"
                color="secondary">
                  {date.monthLong} {date.day}, {date.year}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={6} style={{
                margin: "8px 0px 8px 0px",
                padding: "8px"
            }}>
            <Grid item xs={12} align="center">
            <Typography
                variant="subtitle2"
                color="primary">
                  Workout
              </Typography>
            </Grid>
            <Grid item container xs={12}>
              <RenderWodTextRaw
                wodText={this.state.wodMD["wodText"]}
              />
              </Grid>
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
          <Grid item xs={12} margin={{marginTop: "16px"}}>
              {this.state.scores && this.state.scores.length > 0?
                <ScoreDataView
                  scores={this.state.scores}
                />
              :
                <React.Fragment></React.Fragment>
              }
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={6}>
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
                modalText={`Remove score: ${this.state.curRemoveScore.username} (${this.state.curRemoveScore.score})?`}
                actionText={`Remove`}
                cancelText={`Cancel`}
            />
          </Grid>
        :
          <Grid item xs={12}>
            <Paper elevation={6}>
              <Typography>
                Wod not found!
              </Typography>
            </Paper>
          </Grid>
      }
    </Grid>
  )
  }
}

export default ScoreView = withTheme(ScoreView);


