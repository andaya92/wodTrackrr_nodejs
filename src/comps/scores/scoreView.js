import React, { Component } from 'react'

import{
    Grid, Typography, Tooltip, IconButton
}from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles'
import { AddCircleOutlineTwoTone, ArrowBackIos } from "@material-ui/icons";
import { DateTime } from 'luxon'

import ScoreDataView from "./scoreDataView"
import ScoreList from "./scoreList"
import AddScore from "./addScore"
import ActionCancelModal from "../actionCancelModal"
import BackButton  from "../backButton"
import { getWodScores, removeScore } from "../../utils/firestore/scores"
import { getWod } from "../../utils/firestore/wods"
import { isEmpty } from "../../utils/valid"
import { getFirstOfMonthTS } from "../../utils/formatting"

import "../../styles.css"

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

class ScoreViewContent extends Component {
  constructor(props){
    super(props)
    this.state = {
      userMD: props.userMD,
      wodMD: props.wodMD,
      scores: props.scores,
      userScore: props.userScore,
      curRemoveScore: {},
      showRemoveAlert: false
    }
  }

  static getDerivedStateFromProps(props, state){
    return props
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
        <Grid item xs={12}>
          <Grid item align="center" xs={12}>
            <Typography variant="h6">{this.state.wodMD["boxTitle"]}</Typography>
            <Typography variant="h3">{this.state.wodMD["title"]}</Typography>

            <Grid item xs={12} align="center">
              <Typography
                variant="body2">
                  {date.monthLong} {date.day}, {date.year}
              </Typography>
              <Typography variant="caption">
                  For {this.state.wodMD["scoreType"]}
              </Typography>
            </Grid>
            <Grid item container align="left" xs={12}>
              <RenderWodText
                wodText={this.state.wodMD["wodText"]}
              />
            </Grid>
          </Grid>
          <Grid item align="center" xs={12}>
            <Grid item xs={12} align="right">
              <Tooltip title="Add Score">
                <IconButton color="primary"
                  onClick={this.props.toggleAddScore}
                >
                  <AddCircleOutlineTwoTone />
                </IconButton>
              </Tooltip>
            </Grid>

            {this.state.scores && this.state.scores.length > 0?
              <ScoreDataView
                scores={this.state.scores}
              />
            :
              <React.Fragment></React.Fragment>
            }
          </Grid>

          <Grid item xs={12}>
            <ScoreList
              scores={this.state.scores}
              uid={this.state.userMD.uid}
              onRemove={this.handleRemoveScore.bind(this)}
            />
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
      </Grid>
    )
  }
}
ScoreViewContent = withTheme(ScoreViewContent)

class ScoreView extends Component{
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
      showingAddScore: false
    }
  }

  componentDidMount(){
    this.scoreListener()
    this.wodListener()
  }

  scoreListener(){
    this.scoreListener = getWodScores(
      this.state.boxID,
      this.state.gymClassID,
      this.state.wodID,
      getFirstOfMonthTS()
    )
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
      err => { console.log(err)}
    )
  }

  wodListener(){
    this.wodListener = getWod(this.state.boxID, this.state.gymClassID, this.state.wodID)
    .onSnapshot(ss => {
      this.setState({wodMD: ss.data()})
    },
      err => {console.log(err)})

  }

  componentWillUnmount(){
    if(this.scoreListener !== undefined)
    this.scoreListener()
    if(this.wodListener !== undefined)
    this.wodListener()
  }

  toggleAddScore(ev){
		this.setState({showingAddScore: !this.state.showingAddScore})
	}

  render(){
    let isReady = (!isEmpty(this.state.userMD) && !isEmpty(this.state.wodMD))
    return(
      <React.Fragment>
        {isReady?
          this.state.showingAddScore?
            <Grid item xs={12}>
              <IconButton onClick={this.toggleAddScore.bind(this)}>
                  <ArrowBackIos  style={{color: this.props.theme.palette.text.primary}}/>
              </IconButton>
              <AddScore
                userMD={this.state.userMD}
                wodMD={this.state.wodMD}
                onAlert={this.props.onAlert}
                onClose={this.toggleAddScore.bind(this)}
              />
            </Grid>
          :
            <ScoreViewContent
              userMD={this.state.userMD}
              wodMD={this.state.wodMD}
              scores={this.state.scores}
              userScore={this.props.userScore}
              toggleAddScore={this.toggleAddScore.bind(this)}
            />
        :
          <React.Fragment></React.Fragment>
        }
      </React.Fragment>
    )
  }
}

export default ScoreView = withTheme(ScoreView)


