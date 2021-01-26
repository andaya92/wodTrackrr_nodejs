import firebase from "../context/firebaseContext"
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

import BoxView from "../comps/boxes/boxView" 
import BoxSearch from "../comps/boxes/boxSearch" 

import postData from "../utils/api"
import "../styles.css"

var db = firebase.database();


class BoxSearchPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      showBoxView: false,
      allBoxes: [],
      currentBoxID: null
    }  
  }


  componentDidMount(){
    this.allBoxesListener = db.ref("boxes")
    .on('value', ss => {
      if(ss && ss.exists()){
        let arr = this.objectsToArray(ss.val())
        arr.sort((x, y) => {return x.get("title").toLowerCase() > y.get("title").toLowerCase() ? -1 : 1})
        
        this.setState({
          allBoxes: arr
        })
      }
    })
  }


  componentWillUnmount(){
    if(this.allBoxesListener !== undefined){
      this.allBoxesListener()
    }
  }

    objectsToArray(obj){
    return Array.from(Object.entries(obj), entry => {
       return new Map(Object.entries(entry[1]));
    })
  }

  handleBoxView(boxID){
    this.setState({showBoxView: true, currentBoxID: boxID})
  }

  componentWillReceiveProps(newProps){
    this.setState({...newProps})
  }
  handleBack(){
    this.setState({showBoxView: false})
  }


  render () {
    return (
    	<Grid item xs={12} >
      {!this.state.showBoxView
        ?
          <React.Fragment>
          {
            this.state.allBoxes.length > 0?
            <BoxSearch 
                handleBoxView={this.handleBoxView.bind(this)}
                allBoxes={this.state.allBoxes}
                isOwner={false}
                handleRemoveBox={this.props.handleRemoveBox}
            />
            :
            <React.Fragment></React.Fragment>
          }
          </React.Fragment>
        :
        
        <BoxView userMD={this.state.userMD} 
          handleBack={this.handleBack.bind(this)} 
          boxID={this.state.currentBoxID}
          isReadOnly={true}
        />

      }
      
  		</Grid>
    )
  }
}
export default BoxSearchPage = withTheme(BoxSearchPage);
