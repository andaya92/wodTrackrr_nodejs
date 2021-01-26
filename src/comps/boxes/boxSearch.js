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


import postData from "../../utils/api"
import "../../styles.css"

class BoxSearch extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      isOwner: props.isOwner,
      allBoxes: props.allBoxes,
      filteredBoxes: props.allBoxes
    }  
  }

  componentDidMount(){
  	this.setState({filteredBoxes: this.props.allBoxes})
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
          )
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
                    handleBoxView={this.props.handleBoxView}
                    handleRemoveBox={this.props.handleRemoveBox}
                    isOwner={this.props.isOwner}
                    />
          })
        }
      </Grid>
      </Grid>
    );
  }
}


function Box(props){
  let title = props.info.get("title")
  let boxID = props.info.get("boxID")
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
