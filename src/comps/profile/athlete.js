import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/database"; 

import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom';

import { Grid, Paper, Button, Typography, Collapse } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import UserScoreList from '../scores/userScoreList'

var db = firebase.database();

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
    db.ref(`scores`).orderByChild("uid").equalTo(this.state.user.uid)
    .on("value", userScoresSS => {
      if(userScoresSS && userScoresSS.exists()){
        let value = userScoresSS.val()
        let userScores = Object.keys(value).map(wodID => {
          return value[wodID]
        })
        console.log(userScores)
        this.setState({userScores: userScores})
      }
    })
  }

  componentWillReceiveProps(newProps){
    this.setState({...newProps})
  }

  render(){
    return(
      <Grid xs={12}>
        <Grid xs={12}>
          <Grid xs={12}>
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