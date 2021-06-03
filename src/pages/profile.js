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

import { getUserClassMembers } from "../utils/firestore/classMember"
import { getUserClassAdmins } from "../utils/firestore/classAdmin"
import { getUserScores } from "../utils/firestore/scores"
import { getFirstOfMonthTS } from "../utils/formatting"

let fs = firebase.firestore()

class PageContentRaw extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      emailAlertOpen: false,
      scores: [],
      adminClasses: [],
      memberClasses: []
    }
  }

  static getDerivedStateFromProps(props, state){
    return state.userMD? state: props
  }

  componentWillUnmount(){
    if(this.cancelablePromise){
      console.log("email cancelled")
      this.cancelablePromise.cancel()
    }
    if(this.listener)
      this.listener()
    if(this.userClassAdminsListener)
      this.userClassAdminsListener()
    if(this.userClassMembersListener)
      this.userClassMembersListener()
  }

  componentDidMount(){
    this.listenForUserScores()
    this.adminClassListener()
    this.memberClassListener()
  }

  listenForUserScores(){
    if(!this.listener){
      this.listener = getUserScores(
        this.state.user.uid,
        "date",
        getFirstOfMonthTS()
      )
      .onSnapshot(ss => {
        if(!ss.empty){
          let scores = []
          ss.forEach(doc => {
            scores.push(doc.data())
          })
          scores.sort((a, b) => {
           return (a.date > b.date)? 1 : -1
          })
          console.log(scores)
          this.setState({scores: scores })
        }else{
          this.setState({scores: [] })
          console.log("User scores empty")
        }
      },
      err => {console.log(err)})
    }
  }

  adminClassListener(){
    if(this.state.userMD.uid && !this.userClassAdminsListener){
      this.userClassAdminsListener = getUserClassAdmins(this.state.userMD.uid)
      .onSnapshot(ss => {
        let classes = []
        if(!ss.empty){
          ss.forEach(doc => {
            classes.push(doc.data())
          })
          classes.sort((a, b) => {
            return (a.date > b.date)? 1 : -1
          })
          this.setState({ adminClasses: classes })
        }else{
          this.setState({ adminClasses: classes })
        }
      },
      err => {
        console.log(err)
      })
    }
  }

  memberClassListener(){
    if(this.state.userMD && !this.userClassMembersListener){
      console.log(`Looking for members for ${this.state.userMD.uid}`)
      this.userClassMembersListener = getUserClassMembers(this.state.userMD.uid)
      .onSnapshot(ss => {
        let classes = []
        if(!ss.empty){
          ss.forEach(doc => {
            classes.push(doc.data())
          })
          classes.sort((a, b) => {
            return (a.date > b.date)? 1 : -1
          })
          this.setState({ memberClasses: classes })
        }else{
          this.setState({ memberClasses: classes })
        }
      },
      err => {
          console.log(err)
      })
    }
  }

  render(){

    let isMemberOfClass = this.state.adminClasses.length > 0 ? 1 : 0
    let isAdminOfClass = this.state.memberClasses.length > 0 ? 1 : 0
    let numPanels = isMemberOfClass + isAdminOfClass + 1
    let panelSize = 12 / numPanels
    return (
      <Grid item container align="center">
        <Grid item xs={12} style={{margin: "16px 0px 0px 0px "}}>
            <Typography gutterBottom variant="h5" >
              { this.state.userMD.username }
            </Typography>
        </Grid>

        <Grid item xs={12}>
          <Grid item container xs={12}>
            <AdminInvites userMD={this.state.userMD}/>
            <MemberInvites userMD={this.state.userMD}/>
          </Grid>

          <Grid item container xs={12} spacing={2}>
            <Grid item xs={12} >
              <Typography>Following</Typography>
              <UserFollows userMD={this.state.userMD} />
            </Grid>

            {this.state.adminClasses.length > 0?
              <Grid item xs={12} >
                <Typography>Administrator</Typography>
                <ClassAdminView
                  classes={this.state.adminClasses}
                />
              </Grid>
            :
              <React.Fragment></React.Fragment>
            }

            {this.state.memberClasses.length > 0?
              <Grid item xs={12} >
                <Typography>Membership</Typography>
                <ClassMemberView
                  classes={this.state.memberClasses}
                />
              </Grid>
            :
              <React.Fragment></React.Fragment>
            }
          </Grid>

          <Grid item xs={12}>
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
          </Grid>
        </Grid>
    </Grid>
    )
  }
}

const PageContent = withRouter(withTheme(PageContentRaw))

class ProfilePage extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      timeComponentMounted: 0,
      isLoading: true
    }
  }

  /*
    login.js has the form and does the login, calls this with the user obj
  */
  handleLogIn(user){
      this.setState({user: user} )
  }

  timer(){
    return new Promise(res => {
      setTimeout(res, 5000)
    })
  }

  componentDidMount(){
    this.timer()
    .then(() => {
      this.setState({isLoading: false})
    })
  }

  static getDerivedStateFromProps(props, state){
    return props
  }

  render () {
    return (
    	<Grid item xs={12} id="profilepage">
        {this.state.user?
          <PageContent
              user= {this.state.user}
              userMD={this.state.userMD}
              onAlert={this.props.onAlert}
          />
        :
          <Grid item align="center" xs={12}>
            {this.state.isLoading?
              <Paper>
                <Grid item xs={12} align="center">
                  <Typography>Loading</Typography>
                </Grid>
              </Paper>
            :
              <Button
                variant="outlined"  color="primary"
                onClick={(ev) => {
                  this.props.history.push("/login")
                }}
              >
                Login
              </Button>
            }
          </Grid>
      }
  		</Grid>
    )
  }
}

export default ProfilePage = withRouter(withTheme(ProfilePage))
