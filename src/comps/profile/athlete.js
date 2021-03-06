import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom';

import { Grid, Paper, Button, Typography, Collapse } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import UserScoreList from '../scores/userScoreList'


class Athlete extends Component{
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      scores: props.scores
    }
  }





  static getDerivedStateFromProps(props, state){
    return props
  }

  render(){
    return(

      <Grid item xs={12}>
        <Paper elevation={6}>
          <Grid item xs={12}>
            <Grid item xs={12}>
                <Typography>Scores</Typography>
            </Grid>
            <Grid item xs={12}>
              <UserScoreList
                uid={this.state.user.uid}
                scores={this.state.scores}
                onAlert={this.props.onAlert}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    )
  }
}

export default Athlete = withTheme(Athlete);