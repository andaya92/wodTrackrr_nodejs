import firebase from "../context/firebaseContext"
import "firebase/firestore"

import React, { Component } from 'react'

import { Grid, Paper, Button, Typography, Collapse,
        Accordion, AccordionSummary, AccordionDetails }
from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';
import { Redirect, withRouter } from "react-router-dom";


import OwnerControls from "../comps/ownerControls"
import UserFollows from '../comps/followers/userFollows'
import Athlete from '../comps/profile/athlete'
import AdminInvites from "../comps/profile/adminInvites"
import MemberInvites from "../comps/profile/memberInvites"
import ClassAdminView from "../comps/profile/classAdminView"
import ClassMemberView from "../comps/profile/classMemberView"
import CalendarScoreView from "../comps/calendar/calendarView"

import { getUserScores } from "../utils/firestore/scores"

let fs = firebase.firestore()

class PageContentRaw extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      emailAlertOpen: false,
      scores: []
    }
  }

  static getDerivedStateFromProps(props, state){

    return props
  }

  componentWillUnmount(){
    if(this.cancelablePromise){
      console.log("email cancelled")
      this.cancelablePromise.cancel()
    }
    if(this.listener)
      this.listener()
  }

  componentDidMount(){
    this.listenForUserScores()
  }

  listenForUserScores(){
    if(!this.listener){
      this.listener = getUserScores(this.state.user.uid, "uid", this.state.user.uid)
      .onSnapshot(ss => {
        if(!ss.empty){
          let scores = []
          ss.forEach(doc => {
            scores.push(doc.data())
          })
          scores.sort((a, b) => {
           return (a.date > b.date)? 1 : -1
          })
          this.setState({scores: scores })
        }else{
          this.setState({scores: [] })
        }
      },
      err => {console.log(err)})
    }
  }



  render(){
    return (
      <Grid item container align="center">
        <Grid item xs={12}>
          <Collapse in={this.state.emailAlertOpen}>
            <Alert onClose={() => {this.setState({emailAlertOpen: false})}}>
              Email sent!
            </Alert>
          </Collapse>
        </Grid>
        <Grid item xs={12} style={{margin: "16px 0px 0px 0px "}}>
          <Paper elevation={4}>
            <Typography gutterBottom variant="h5" >
              { this.state.userMD.username }
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} style={{margin: "16px 0px 0px 0px "}}>
          <Paper elevation={4}>
            <CalendarScoreView
              userMD={this.state.userMD}
              scores={this.state.scores}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} style={{margin: "16px 0px 0px 0px "}}>
          <Paper elevation={4}>

          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Grid item container xs={12}>


              <AdminInvites userMD={this.state.userMD}/>
              <MemberInvites userMD={this.state.userMD}/>
              <ClassAdminView userMD={this.state.userMD}/>
              <ClassMemberView userMD={this.state.userMD}/>

             <Grid item xs={12} style={{margin: "16px 0px 0px 0px "}}>
               <Paper elevation={4}>
                <UserFollows
                  user={this.state.user}
                  userMD={this.state.userMD}
                 />
               </Paper>
              </Grid>
        </Grid>

        <Paper elevation={2} style={{margin: "16px 0px 0px 0px"}}>
          {this.state.userMD.accountType === "owner" ?
            <OwnerControls
              user={this.state.user}
              userMD={this.state.userMD}
              onAlert={this.props.onAlert}
              />
          :
            <Athlete
              user={this.state.user}
              userMD={this.state.userMD}
              onAlert={this.props.onAlert}
              scores={this.state.scores}
            />
          }
          </Paper>
        </Grid>
    </Grid>
    )
  }
}

const PageContent = withTheme(PageContentRaw)

class ProfilePage extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD
    }
  }

  /*
    login.js has the form and does the login, calls this with the user obj
  */
  handleLogIn(user){
      this.setState({user: user} )
  }

  static getDerivedStateFromProps(props, state){
    return props
  }

  render () {
    console.log("user", this.state.user)

    return (
    	<Grid item xs={12} id="profilepage">
        {this.state.user?
          <PageContent
              user= {this.state.user}
              userMD={this.state.userMD}
              onAlert={this.props.onAlert}
          />
        :
          <Redirect to="/login" />
      }
  		</Grid>
    );
  }
}

export default ProfilePage = withRouter(withTheme(ProfilePage))
