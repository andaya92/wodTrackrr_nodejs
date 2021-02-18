
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { Grid, Paper, Button, Typography, Collapse,
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

  componentDidMount(){
    getFollowers(this.state.user.uid)
    .onSnapshot(followingSS => {
      followingSS.docChanges().forEach(change => {
        switch(change.type){    
          case "added":
            console.log("Case Added!")
            let follows = []
            let following = {}
            
            followingSS.forEach(doc => {
              let data = doc.data()
              follows.push(data)
              following[data.boxID] = data.followID
            })

            this.setState({
              userFollows: follows,
              userFollowing: following
            })

            break
          case "modified":
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

  handleFollow(follow){
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
          <TableContainer>
            <Table>
              {this.state.userFollows.length > 0 ?
                this.state.userFollows.map(follow => {
                  return (
                    <TableRow>
                      <TableCell>
                        <Link
                          to={`box/${follow.boxID}`}
                          component={Button}
                        >
                          {follow.title}
                        </Link>
                      </TableCell>
                       <TableCell align="right">
                        { this.isUserFollowing(follow.boxID) ?
                            <Button variant="outlined"
                              onClick={()=>{
                                this.handleUnfollow(follow.boxID)}
                              }>
                              <Whatshot color="primary" />
                            </Button>
                          :
                            <Button variant="outlined" color="error" 
                              onClick={()=>{
                                this.handleFollow(follow)
                              }}>
                              <Whatshot />
                            </Button>
                        }
                      </TableCell>
                    </TableRow>
                  )
                })
              :
                <React.Fragment>Not following anyone!</React.Fragment>
              }
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    )
  }
}

export default UserFollows = withTheme(UserFollows);