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

import BoxView from "../comps/boxView" 


import postData from "../utils/api"
import "../styles.css"

var db = firebase.database();


function Box(props){
  let title = props.info.get("title")
  let boxID = props.info.get("boxID")
  console.log(props.color)
  return(
    <Grid item xs={12}>
      <Paper>
        <Grid container itemxs={12}>
        <Grid item xs={10}>
          <Typography align="left" style={{padding: "2.5vw"}} variant="body1">
            {title}
          </Typography>
        </Grid>

        <Grid container item xs={2} align="center" alignItems='center'>
          <Button 
              variant="outlined"
              color="primary"
              onClick={()=>{props.handleBoxView(boxID)}}>
              View
            </Button>
        </Grid>
      </Grid>
      </Paper>
    </Grid>)
}




class BoxSearch extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      allBoxes: new Array(),
      filteredBoxes: new Array()
    }  
  }

  objectsToArray(obj){
    return Array.from(Object.entries(obj), entry => {
       return new Map(Object.entries(entry[1]));
    })
  }

  componentDidMount(){
    this.allBoxesListener = db.ref("boxes")
    .on('value', ss => {
      if(ss && ss.exists()){
        let arr = this.objectsToArray(ss.val())
        arr.sort((x, y) => {return x.get("title").toLowerCase() > y.get("title").toLowerCase() ? -1 : 1})
        this.setState({
          allBoxes: arr,
          filteredBoxes: arr
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

  onKeyUp(data){
    if((data.keyCode || data.which) == 13){
        
    }
  }

  onChange(ev){
    let val = ev.target.value
    console.log(val)
    let filteredBoxes = this.state.allBoxes.filter(box =>{
      return box.get("title").toLowerCase().includes(val.toLowerCase())
    })

    this.setState({filteredBoxes: filteredBoxes})
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
          ),
        }}
      />
      
      
      
      </Paper>
      <Grid item xs={12}>
        {
          this.state.filteredBoxes.map((box, i) => {
            return <Box 
                    key={i} 
                    info={box} 
                    color={this.props.theme.palette.primary.mainGrad}
                    handleBoxView={this.props.handleBoxView}/>
          })
        }
      </Grid>
      </Grid>
    );
  }
}


class BoxSearchPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      showBoxView: false,
      currentBoxID: null
    }  
  }


  componentDidMount(){
   
  }

  
  componentWillUnmount(){
    
  }

  handleBoxView(boxID){
    console.log(`Show details for: ${boxID}`)
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
        <BoxSearch 
            theme={this.props.theme}
            handleBoxView={this.handleBoxView.bind(this)} />
        :
        
        <BoxView userMD={this.state.userMD} handleBack={this.handleBack.bind(this)} boxID={this.state.currentBoxID} />

      }
      }
  		</Grid>
    )
  }
}
export default BoxSearchPage = withTheme(BoxSearchPage);
