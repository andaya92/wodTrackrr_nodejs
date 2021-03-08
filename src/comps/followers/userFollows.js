
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { Grid, Paper, Button, Typography, IconButton,
        TableBody, Table, TableCell, TableContainer, TableRow }
from '@material-ui/core';

import Whatshot from '@material-ui/icons/Whatshot'
import { Alert } from '@material-ui/lab'
import { withTheme } from '@material-ui/core/styles'

import { getFollowers, setFollow, removeFollow } from "../../utils/firestore/follows"


class UserFollows extends Component{
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      userFollows: [],
      userFollowing: {}
    }
  }

  extractData(ss){
    let follows = []
    let following = {}

    ss.forEach(doc => {
      let data = doc.data()
      follows.push(data)
      following[data.boxID] = data.followID
    })
    return [follows, following]
  }

  componentDidMount(){
   this.getFollowers = getFollowers(this.state.user.uid)
    .onSnapshot(followingSS => {
      let [follows, following] = this.extractData(followingSS)
      followingSS.docChanges().forEach(change => {
        switch(change.type){
          case "added":
            this.setState({
              userFollows: follows,
              userFollowing: following
            })

            break
          case "modified":
            let modData = change.doc.data()
            console.log(modData)

            this.setState({
              userFollows: follows,
              userFollowing: following
            })


            break
          case "removed":
            let data = change.doc.data()
            let userFollowing = this.state.userFollowing
            userFollowing[data.boxID] = undefined
            this.setState({userFollowing: userFollowing})


            break
          default:
            console.log("Uncaught change.")
        }
      })
    })
  }

  componentWillUnmount(){
    if(this.getFollowers){
      this.getFollowers()
    }
  }

  handleFollow(follow){
    console.log(follow)
    if(follow.boxID === ""){
      return
    }

    setFollow(this.state.user.uid, this.state.userMD.username, follow.boxID,
              follow.title)
    .then(res => {console.log("Succefully followed.")})
    .catch(err => {console.log(err)})
  }

  handleUnfollow(boxID){
    let followID = this.state.userFollowing[boxID]

    removeFollow(followID)
    .then(res => {
      if(res){
        let userFollowing = this.state.userFollowing
        userFollowing[boxID] = undefined
        this.setState({userFollowing: userFollowing})
        console.log("Succefully unfollowed.")
      }
    })
    .catch(err => {console.log(err)})
  }

  isUserFollowing(boxID){
    return (this.state.userFollowing[boxID])? true: false
  }

  static getDerivedStateFromProps(props, state){
    return props
  }

  render(){
    return(
      <Grid item xs={12}>
          <Paper elevation={6}>
            <Grid item xs={12}>
              <Typography>Following</Typography>
            </Grid>
            <Grid item xs={12}>
                {this.state.userFollows.length > 0 ?
                  <TableContainer>
                    <Table>
                      <TableBody>
                        {this.state.userFollows.map((follow, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell>
                                {follow.boxID === "" ?
                                  <Button>
                                    {follow.title} <Typography variant="caption" component="span">&nbsp;(deleted)</Typography>
                                  </Button>
                                :
                                  <Button
                                    to={`box/${follow.boxID}`}
                                    component={Link}
                                  >
                                    {follow.title}
                                  </Button>
                              }
                              </TableCell>
                                <TableCell align="right">
                                { this.isUserFollowing(follow.boxID) ?
                                    <IconButton
                                      onClick={()=>{
                                        this.handleUnfollow(follow.boxID)}
                                      }>
                                      <Whatshot color="primary" />
                                    </IconButton>
                                  :
                                    <IconButton
                                      onClick={()=>{
                                        this.handleFollow(follow)
                                      }}>
                                      <Whatshot style={{fill: this.props.theme.palette.text.primary}}/>
                                    </IconButton>
                                }
                              </TableCell>
                            </TableRow>
                          )
                        })
                        }
                    </TableBody>
                  </Table>
                </TableContainer>
                :
                  <React.Fragment>Not following anyone!</React.Fragment>
                }
          </Grid>

          </Paper>
      </Grid>
    )
  }
}

export default UserFollows = withTheme(UserFollows);