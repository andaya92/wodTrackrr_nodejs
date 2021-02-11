import firebase from "../context/firebaseContext"
import "firebase/auth";
import "firebase/database"; 

import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom';

import { Grid, Paper, Button, Typography, Collapse, IconButton, TextField,
InputBase, InputAdornment }
from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

import BoxView from "../comps/boxes/boxView" 
import BoxSearch from "../comps/boxes/boxSearch" 

import "../styles.css"

let fs = firebase.firestore()

class BoxSearchPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      allBoxes: []
    }  
  }

  componentDidMount(){
    this.allBoxesListener = fs.collection("boxes")
    .onSnapshot(ss => {
      if(!ss.empty){
        let boxes = []
        ss.forEach(doc => {
          boxes.push(doc.data())
        })
        boxes.sort((x, y) => {
          return x["title"].toLowerCase() > y["title"].toLowerCase() ? -1 : 1
        })        
        this.setState({
          allBoxes: boxes
        })
      }
    })
  }

  componentWillUnmount(){
    if(this.allBoxesListener !== undefined){
      this.allBoxesListener()
    }
  }

  componentWillReceiveProps(newProps){
    this.setState({...newProps})
  }

  render () {
    return (
    	<Grid item xs={12} >
        {
          this.state.allBoxes.length > 0?
          <BoxSearch 
              user={this.state.user}
              userMD={this.state.userMD}
              allBoxes={this.state.allBoxes}
              isOwner={false}
              isReadOnly={false}
              handleRemoveBox={this.props.handleRemoveBox}
          />
          :
          <Grid xs={12}>
            <Paper elevation={2}>
              No boxes!
            </Paper>
          </Grid>
        }
  		</Grid>
    )
  }
}

export default BoxSearchPage = withTheme(BoxSearchPage);
