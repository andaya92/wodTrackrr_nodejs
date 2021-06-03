
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'

import { Grid, Paper, Button, Typography, IconButton,
        TableBody, Table, TableCell, TableContainer, TableRow, TableHead}
from '@material-ui/core';

import Whatshot from '@material-ui/icons/Whatshot'
import { Alert } from '@material-ui/lab'
import { withTheme, withStyles } from '@material-ui/core/styles'

import ActionCancelModal from "../actionCancelModal"
import { getUserFollowers, setFollow, removeFollow } from "../../utils/firestore/follows"


const StyledTableCell = withStyles({root:{
	borderBottom: "none"
}})(TableCell)


class UserFollows extends Component{
  constructor(props){
    super(props)
    this.state = {
      userMD: props.userMD,
      userFollows: [],
      showRemoveAlert: false,
      removeBoxID: ""
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
    this.getUserFollowers = getUserFollowers(this.state.userMD.uid)
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
    this.setState({removeBoxID: boxID, showRemoveAlert: true})
  }

  unfollow(){
    if(!this.state.removeBoxID.length > 0) return

    removeFollow(this.state.userMD.uid, this.state.removeBoxID)
    .then(res => {
      if(res){
         let userFollowing = this.state.userFollowing
         try{
           userFollowing[this.state.removeBoxID] = undefined
           console.log("Succefully unfollowed.")
         }catch{
           console.log("Error with removing follow.")
         }

         this.setState({userFollowing: userFollowing, showRemoveAlert: false})
      }
    })
    .catch(err => {console.log(err)})
  }

  static getDerivedStateFromProps(props, state){
    return props
  }

  viewBox(boxID){
    console.log(this.props)
    this.props.history.push(`box/${boxID}`)
  }

  handleModalClose(){
    this.setState({showRemoveAlert: false})
  }

  render(){
    return(
      <React.Fragment>
        <Table size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left" colSpan={2}>
              Gym
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {this.state.userFollows.length > 0 ?
          this.state.userFollows.map((follow, i) => {
            return (
              <TableRow key={i} onClick={(ev) => {
                  if(["path", "svg"].indexOf(ev.target.tagName) > -1) return
                  this.viewBox(follow.boxID)
                }
              }>
                <StyledTableCell>
                  <Typography color="primary">
                    {follow.title}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton size="small"
                    onClick={()=>{
                      this.handleUnfollow(follow.boxID)}
                    }>
                  <Whatshot color="primary" />
                  </IconButton>
                </StyledTableCell>
              </TableRow>
            )
          })
        :
          <TableRow>
            <StyledTableCell align="center">
              Not following anyone!
            </StyledTableCell>

          </TableRow>
        }
        </TableBody>
      </Table>

      <ActionCancelModal
        open={this.state.showRemoveAlert}
        onClose={this.handleModalClose.bind(this)}
        onAction={this.unfollow.bind(this)}
        modalText={ `Are you sure you want to unfollow?`}
        actionText={"Unfollow"}
        cancelText={"Cancel"}
      />
    </React.Fragment>
    )
  }
}

export default UserFollows = withRouter(withTheme(UserFollows))