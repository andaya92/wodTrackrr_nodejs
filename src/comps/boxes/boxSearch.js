import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/database"; 

import React, { Component } from 'react'
import { Route, Link, Redirect } from 'react-router-dom';

import 
{Grid, Paper, Button, Typography, Collapse, IconButton, TextField,
InputBase, InputAdornment, TableBody, Table, TableCell, TableContainer,
  TableHead, TableRow }
from '@material-ui/core'

import { Alert } from '@material-ui/lab'
import SearchIcon from '@material-ui/icons/Search'
import { withTheme } from '@material-ui/core/styles'

import Delete from '@material-ui/icons/Delete'
import Waves from '@material-ui/icons/Waves'
import Whatshot from '@material-ui/icons/Whatshot'

import BoxView from "./boxView" 

import { setFollow, removeFollow } from "../../utils/firestore/follows"
import "../../styles.css"

const fs = firebase.firestore()

function BoxRaw(props){
  let title = props.info["title"]
  let boxID = props.info["boxID"]

  return(
    <TableRow id={`box/${boxID}`} name="BoxRow" onClick={(ev) => props.onRowClick(ev, `box/${boxID}`)}>
      <TableCell align="left">
        <Typography variant="subtitle" color="primary">
          { title }
        </Typography>
      </TableCell>
      <TableCell align="right">
        { props.isUserFollowing ?
          <Button variant="outlined"
              onClick={()=>{props.handleUnfollow(boxID)}}>
            <Whatshot color="primary" />
          </Button>
        :
          <Button
            onClick={()=>{props.handleFollow(props.info)}}>
            <Whatshot/>
          </Button>
        }
        { props.isOwner ?
          <Button
            onClick={()=>{props.handleRemoveBox(boxID, title)}}>
            <Delete  color="error" />
          </Button>
        :
          <React.Fragment></React.Fragment>
        }
      </TableCell>
    </TableRow>
  )
 
}
const Box = withTheme(BoxRaw)

class BoxSearch extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      isOwner: props.isOwner,
      allBoxes: props.allBoxes,
      filteredBoxes: props.allBoxes,
      userFollowing: {},
      redirect: false,
      redirectTo: ""
    }
  }

  componentDidMount(){
    this.listenForFollowing(this.props)
  }

  componentWillReceiveProps(newProps){
    this.setState({...newProps})
    this.listenForFollowing(newProps)
  }

  onKeyUp(data){
    if((data.keyCode || data.which) == 13){   
    }
  }

  listenForFollowing(props){
    if(props.user){
      fs.collection("following").where("uid", "==", props.user.uid)
      .onSnapshot(ss => {
        let following = {}
        if(!ss.empty){
          
          ss.forEach(doc =>{
            let data = doc.data()
            console.log(data)
            following[data.boxID] = data.followID
          })
      }
      this.setState({userFollowing: following})
      }, 
      err => console.log(err))
    }
  }

  onChange(ev){
    let val = ev.target.value
    let filteredBoxes = this.state.allBoxes.filter(box =>{
      return box["title"].toLowerCase().includes(val.toLowerCase())
    })
    this.setState({filteredBoxes: filteredBoxes})
  }

  isUserFollowing(boxID){
    return (this.state.userFollowing[boxID])? true: false
  }
  
  handleFollow(boxInfo){
    setFollow(this.state.user.uid, this.state.userMD.username, boxInfo.boxID,
              boxInfo.title)
    .then(res => {console.log("Succefully followed.")})
    .catch(err => {console.log(err)})
  }

  handleUnfollow(boxID){
    let followID = this.state.userFollowing[boxID]

    removeFollow(followID)
    .then(res => {
      if(res){
        console.log("Succefully unfollowed.")
      }
    })
    .catch(err => {console.log(err)})
  }

  onRowClick(ev, id){
    console.log(id)
    if(ev.target.tagName === "TD"){
      this.setState({redirect: true, redirectTo: id})
    }
  }

  render () {
    return (
      <Grid item xs={12}>
        {this.state.redirect ?
          <Redirect to={this.state.redirectTo} />
        :
          <React.Fragment></React.Fragment>
        }
        <Grid item xs={12} style={{margin: "0px 0px 8px 0px"}}>
        <Paper elevation={2} component="form">
           <TextField
             fullWidth
              variant="outlined"
              onKeyUp={this.onKeyUp.bind(this)}
              onChange={this.onChange.bind(this)}
              placeholder="Search Boxes"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                )
              }}
          />
        </Paper>
        </Grid>
        <Grid item xs={12}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Boxes</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
    {
      this.state.filteredBoxes.map((box, i) => {
        return <Box 
                key={i} 
                info={box} 
                color={this.props.theme.palette.primary.mainGrad}
                handleBoxView={this.props.handleBoxView}
                handleRemoveBox={this.props.handleRemoveBox}
                isOwner={this.props.isOwner}
                isUserFollowing={this.isUserFollowing(box["boxID"])}
                handleFollow={this.handleFollow.bind(this)}
                handleUnfollow={this.handleUnfollow.bind(this)}
                onRowClick={this.onRowClick.bind(this)}
                />
      })
    }
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    );
  }
}



export default BoxSearch = withTheme(BoxSearch)
