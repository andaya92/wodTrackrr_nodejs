import React, { Component } from 'react'

import {
  Grid, Paper, Button, Typography, IconButton, Tooltip
}from '@material-ui/core';

import { AddCircleOutlined, ArrowBackIos }from '@material-ui/icons'
import { withRouter } from "react-router-dom"
import { withTheme } from '@material-ui/core/styles';

import OwnerControls from "../comps/ownerControls"
import UserFollows from '../comps/followers/userFollows'
import Athlete from '../comps/profile/athlete'
import AdminInvites from "../comps/profile/adminInvites"
import MemberInvites from "../comps/profile/memberInvites"
import ClassAdminView from "../comps/profile/classAdminView"
import ClassMemberView from "../comps/profile/classMemberView"
// import CalendarScoreView from "../comps/calendar/calendarView"

import { getUserFollowers } from "../utils/firestore/follows"
import { getUserClassMembers } from "../utils/firestore/classMember"
import { getUserClassAdmins } from "../utils/firestore/classAdmin"
import { getUserScores } from "../utils/firestore/scores"
import { getFirstOfMonthTS } from "../utils/formatting"

let BackArrow = withTheme((props) => {
  return(
    <IconButton style={{color: props.theme.palette.text.primary}}
      onClick={() => props.onClick(props.index)}
    >
      <ArrowBackIos />
    </IconButton>
  )
})

// class ProfileSummary extends Component {
//   constructor(props){
//     super(props)
//     this.state = {
//       user: props.user,
//       userMD: props.userMD,
//       scores: props.scores,
//       adminClasses: props.adminClasses,
//       memberClasses: props.memberClasses
//     }
//   }
//   static getDerivedStateFromProps(props, state){
//     return props
//   }

//   render(){
//     return(
//       <Grid item container align="center">
//       <Grid item xs={12} style={{margin: "16px 0px 0px 0px "}}>
//           <Typography gutterBottom variant="h5" >
//             { this.state.userMD.username }
//           </Typography>
//       </Grid>

//       <Grid item xs={12}>

//         <Grid item container xs={12} spacing={2}>
//           <Grid item xs={12} >
//             <Typography>Following ({})</Typography>
//             <UserFollows userMD={ this.state.userMD } />
//           </Grid>

//           {this.state.adminClasses.length > 0?
//             <Grid item xs={12} >
//               <Typography>Administrator</Typography>
//               <ClassAdminView
//                 classes={this.state.adminClasses}
//               />
//             </Grid>
//           :
//             <React.Fragment></React.Fragment>
//           }

//           {this.state.memberClasses.length > 0?
//             <Grid item xs={12} >
//               <Typography>Membership</Typography>
//               <ClassMemberView
//                 classes={this.state.memberClasses}
//               />
//             </Grid>
//           :
//             <React.Fragment></React.Fragment>
//           }
//         </Grid>

//         <Grid item xs={12}>
//           {this.state.userMD.accountType === "owner" ?
//             <OwnerControls
//               user={this.state.user}
//               userMD={this.state.userMD}
//               onAlert={this.props.onAlert}
//               />
//           :
//             <Athlete
//               user={this.state.user}
//               userMD={this.state.userMD}
//               onAlert={this.props.onAlert}
//               scores={this.state.scores}
//             />
//           }
//         </Grid>
//       </Grid>
//     </Grid>
//     )
//   }
// }

class PageContent extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      scores: [],
      adminClasses: [],
      memberClasses: [],
      userFollows: [],
      showDetails: [false, false, false]
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
    if(this._userScoreListener)
      this._userScoreListener()
    if(this._userClassAdminListener)
      this._userClassAdminListener()
    if(this._userClassMemberListener)
      this._userClassMemberListener()
    if(this._userFollowsListener)
      this._userFollowsListener()
  }

  componentDidMount(){
    this.userFollowsListener()
    this.userScoreListener()
    this.userClassAdminListener()
    this.userClassMemberListener()
  }

  userFollowsListener(){
    if(this.state.userMD.uid && !this._userFollowsListener){
      this._userFollowsListener = getUserFollowers(this.state.userMD.uid)
     .onSnapshot(followingSS => {
        let follows = []
        followingSS.forEach(doc => {
          follows.push(doc.data())
        })
        this.setState({userFollows: follows})
      })
    }
  }

  userScoreListener(){
    if(!this._userScoreListener){
      this._userScoreListener = getUserScores(
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

  userClassAdminListener(){
    if(this.state.userMD.uid && !this._userClassAdminListener){
      this._userClassAdminListener = getUserClassAdmins(this.state.userMD.uid)
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

  userClassMemberListener(){
    if(this.state.userMD && !this._userClassMemberListener){
      console.log(`Looking for members for ${this.state.userMD.uid}`)
      this._userClassMemberListener = getUserClassMembers(this.state.userMD.uid)
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

  onView(index){
    let showDetails = this.state.showDetails.map((el, i) => {
      if(index === i)
        return true
      return false
    })
    this.setState({
      showDetails: showDetails
    })
  }

  render(){

    let isAdminOfClass = this.state.adminClasses.length > 0 ? 1 : 0
    let isMemberOfClass = this.state.memberClasses.length > 0 ? 1 : 0
    let numPanels = isMemberOfClass + isAdminOfClass + 1
    let panelSize = 12 / numPanels
    /*
      IF else series to show detailed component
        followers
        admins class
        member class

        showUserFollows: false,
        showUserClassAdmins: false,
        showUserClassMembers: false
        else show summary profile page
      */
    return (
      <Grid item container align="center">
        {this.state.showDetails[0]?
          <React.Fragment>
            <BackArrow onClick={this.onView.bind(this)} index={-1} />
            <Typography variant="h2">Following</Typography>
            <UserFollows
              userMD={this.state.userMD}
              userFollows={this.state.userFollows}/>
            </React.Fragment>
        : this.state.showDetails[1]?
            <React.Fragment>
             <BackArrow onClick={this.onView.bind(this)} index={-1} />
             <Typography variant="h2">Admin</Typography>
              <ClassAdminView
                classes={this.state.adminClasses}/>
            </React.Fragment>
        : this.state.showDetails[2]?
            <React.Fragment>
              <BackArrow onClick={this.onView.bind(this)} index={-1} />
              <Typography variant="h2">Member</Typography>
              <ClassMemberView
                classes={this.state.memberClasses} />
            </React.Fragment>

        : /* Profile Page Summary */
          <Grid item xs={12}>
            <Grid item xs={12} style={{margin: "16px 0px 0px 0px "}}>
              <Typography gutterBottom variant="h5" >
                { this.state.userMD.username }
              </Typography>
            </Grid>

            <Grid item container xs={12}>
              <AdminInvites userMD={this.state.userMD}/>
              <MemberInvites userMD={this.state.userMD}/>
            </Grid>

            <Grid item container xs={12} justify="flex-end">
              <Grid item container xs={5} justify="center">
                <Grid item xs={panelSize}>
                    <Tooltip title="View Following">
                      <Typography variant="caption" onClick={() => this.onView(0)}>
                        Following({this.state.userFollows.length})
                        <IconButton>
                          <AddCircleOutlined color="primary" />
                        </IconButton>
                      </Typography>
                    </Tooltip>
                  </Grid>
                {isAdminOfClass?
                  <Grid item xs={panelSize}>
                    <Tooltip title="View Admin">
                      <Typography variant="caption" onClick={() => this.onView(1)}>
                        Admin({this.state.adminClasses.length})
                        <IconButton>
                          <AddCircleOutlined color="primary" />
                        </IconButton>
                      </Typography>
                    </Tooltip>
                  </Grid>
                :
                  <React.Fragment></React.Fragment>
                }
                {isMemberOfClass?
                  <Grid item xs={panelSize}>
                    <Tooltip title="View Membership" >
                      <Typography variant="caption" onClick={() => this.onView(2)}>
                        Member({this.state.memberClasses.length})
                        <IconButton >
                          <AddCircleOutlined color="secondary" />
                        </IconButton>
                      </Typography>
                    </Tooltip>
                  </Grid>
                :
                  <React.Fragment></React.Fragment>
                }
              </Grid>
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
        }
    </Grid>
    )
  }
}

PageContent = withRouter(withTheme(PageContent))

class ProfilePage extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      timeComponentMounted: 0,
      isLoading: true
    }
    this.mountedIndicator = React.createRef()
  }

  /*
    login.js has the form and does the login, calls this with the user obj
  */
  handleLogIn(user){
      this.setState({user: user} )
  }

  timer(){
    // Timer to control when the login button will appear.
    return new Promise(res => {
      setTimeout(res, 2000)
    })
  }

  componentDidMount(){
    this.timer()
    .then(() => {
      if(this.mountedIndicator.current){
        this.setState({isLoading: false})
      }
    })
  }

  static getDerivedStateFromProps(props, state){
    return props
  }

  render () {
    return (
    	<Grid item xs={12} id="profilepage" ref={this.mountedIndicator}>
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
