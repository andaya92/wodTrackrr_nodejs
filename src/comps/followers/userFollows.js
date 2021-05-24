
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { Grid, Paper, Button, Typography, IconButton,
        TableBody, Table, TableCell, TableContainer, TableRow, TableHead}
from '@material-ui/core';

import Whatshot from '@material-ui/icons/Whatshot'
import { Alert } from '@material-ui/lab'
import { withTheme } from '@material-ui/core/styles'

import { getUserFollowers, setFollow, removeFollow } from "../../utils/firestore/follows"


class UserFollows extends Component{
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      userFollows: [],
    }
  }

  extractData(ss){
    let follows = []
    ss.forEach(doc => {
      follows.push(doc.data())
    })
    return follows
  }

  componentDidMount(){
    this.getUserFollowers = getUserFollowers(this.state.user.uid)
   .onSnapshot(followingSS => {
      let follows = this.extractData(followingSS)
      this.setState({userFollows: follows})
    })
  }


  componentWillUnmount(){
    if(this.getUserFollowers){
      this.getUserFollowers()
    }
  }

  handleFollow(follow){
    console.log(follow)
    if(follow.boxID === ""){
      return
    }

    setFollow(this.state.userMD.uid, this.state.userMD.username, follow.boxID,
      follow.title, follow.owner)
    .then(res => {console.log("Succefully followed.")})
    .catch(err => {console.log(err)})
  }

  handleUnfollow(boxID){
    removeFollow(this.state.userMD.uid, boxID)
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

  static getDerivedStateFromProps(props, state){
    return props
  }

  render(){
    return(
      <Grid item xs={12}>
          <Paper elevation={6}>
            <Grid item xs={12}>
                {this.state.userFollows.length > 0 ?
                  <TableContainer>
                    <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><Typography variant="subtitle1">
                          Following
                        </Typography></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
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
                                <IconButton
                                      onClick={()=>{
                                        this.handleUnfollow(follow.boxID)}
                                      }>
                                      <Whatshot color="primary" />
                                    </IconButton>
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