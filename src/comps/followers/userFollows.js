import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/database"; 

import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom';

import { Grid, Paper, Button, Typography, Collapse } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import {isFollowing, setFollow, getUserFollowers, getBoxFollowers}
from "../../utils/firebase/followers"

var db = firebase.database();

class UserFollows extends Component{
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      userFollowing: []
    }
  }

  toList(value){
    return Object.keys(value).map(key => {
      return value[key]
    })

  }

  componentDidMount(){
    getUserFollowers(this.state.user.uid)
    .on("value", followingSS => {
      if(followingSS && followingSS.exists()){
        this.setState({
          userFollowing: this.toList(followingSS.val())
        })
      }else{
        this.setState({userFollowing: {}})
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
          <Typography>Following</Typography>
          </Grid>
          {this.state.userFollowing.length > 0 ?
            this.state.userFollowing.map(follow => {
              return (
                <Link
                  to={`box/${follow.boxID}`}
                  component={Button}
                >
                  {follow.boxID}
                </Link>)
            })
          :
          <React.Fragment>Not following anyone!</React.Fragment>
          }
        </Grid>
      </Grid>
    )
  }
}

export default UserFollows = withTheme(UserFollows);