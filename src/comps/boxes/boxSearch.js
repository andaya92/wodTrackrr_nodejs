import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/database"; 

import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom';

import 
{Grid, Paper, Button, Typography, Collapse, IconButton, TextField,
InputBase, InputAdornment,  }
from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import SearchIcon from '@material-ui/icons/Search';
import { withTheme } from '@material-ui/core/styles';

import BoxView from "./boxView" 

import { setFollow, removeFollow} from "../../utils/firestore/follows"
import "../../styles.css"

const fs = firebase.firestore()

class BoxSearch extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      isOwner: props.isOwner,
      allBoxes: props.allBoxes,
      filteredBoxes: props.allBoxes,
      userFollowing: {}
    }
  }

  componentDidMount(){
    this.listenForFollowing(this.props)
  }

  componentWillReceiveProps(newProps){
    this.setState({...newProps})
    console.log(newProps)
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
        console.log("Getting follows")
        console.log(ss)
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

  render () {
    return (
      <Grid item xs={12} >
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
      <Grid item xs={12}>
        {
          this.state.filteredBoxes.map((box, i) => {
            console.log(this.isUserFollowing(box["boxID"]))
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
                    />
          })
        }
      </Grid>
      </Grid>
    );
  }
}


function Box(props){
  let title = props.info["title"]
  let boxID = props.info["boxID"]
  let isFollowing = props.isUserFollowing
  return(
    <Grid item xs={12}>
      <Paper>
        <Grid container itemxs={12}>
        <Grid item xs={6}>
          <Typography align="left" style={{padding: "2.5vw"}} variant="body1">
            {title}
          </Typography>
        </Grid>

        <Grid container item xs={2} align="center" alignItems='center'>
          <Link 
            to={`box/${boxID}`}
            component={Button}>
              View
          </Link>
        </Grid>
        <Grid container item xs={2} align="center" alignItems='center'>
          { isFollowing ?
              <Button variant="outlined" color="error" 
                  onClick={()=>{props.handleUnfollow(boxID)}}>Unfollow</Button>
            :
              <Button variant="outlined" color="error" 
                onClick={()=>{props.handleFollow(props.info)}}>Follow</Button>
          }
        </Grid>
        <Grid container item xs={2} align="center" alignItems='center'>
          {
            props.isOwner
            ?
              <Button variant="outlined" color="error" 
                onClick={()=>{props.handleRemoveBox(boxID, title)}}>Remove</Button>
            :
            <React.Fragment></React.Fragment>
          }
        </Grid>
          
      </Grid>
      </Paper>
    </Grid>)
}

export default BoxSearch = withTheme(BoxSearch);
