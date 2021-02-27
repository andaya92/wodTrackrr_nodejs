import firebase from "../../context/firebaseContext"
import "firebase/firestore"; 

import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom';

import { Grid, Paper, Button, Typography, Collapse } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import UserScoreList from '../scores/userScoreList'

let fs = firebase.firestore();

class Athlete extends Component{
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      userScores: []
    }
  }

  componentDidMount(){
    this.listenForUserScores()
  }

  listenForUserScores(){
    fs.collection("scores").where("uid", "==", this.state.user.uid)
    .onSnapshot(ss => {
      console.log(ss)
      if(!ss.empty){
        let scores = []
        ss.forEach(doc => {
          scores.push(doc.data())
        })
        console.log(scores[0])
        scores.sort((a, b) => {
         return (a.date > b.date)? 1 : -1
        })
        this.setState({userScores: scores })
      }else{
        this.setState({userScores: [] })
      }
    },
    err => {console.log(err)})
  }

  static getDerivedStateFromProps(props, state){
    return props
  }

  render(){
    return(
      <Grid item xs={12}>
        <Grid item xs={12}>
          <Grid item xs={12}>
            <Typography>Scores</Typography>
            <UserScoreList
              uid={this.state.user.uid}
              scores={this.state.userScores}
            />
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default Athlete = withTheme(Athlete);