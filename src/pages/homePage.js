import firebase from "../context/firebaseContext"
import "firebase/firestore"

import React, { Component } from 'react'

import { Grid, Paper, Button, Typography, Collapse,
        Accordion, AccordionSummary, AccordionDetails }
from '@material-ui/core';

import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';
import { Redirect, withRouter } from "react-router-dom";


class HomePage extends Component {
  constructor(props){
    super(props)
    console.log(props)
    this.state = {}
  }

  componentDidMount(){
  }

  static getDerivedStateFromProps(props, state){
    return props
  }

  render () {

    return (
    	<Grid item align="center" xs={12}>
          <Paper>
            <Grid item xs={3}></Grid>
            <Grid item xs={6}>
                <Typography variant="h3">Find a gym</Typography>
                <Typography variant="h3">Track your results</Typography>
                <img className="img-responsive" src="nike.png"/>
            </Grid>
          </Paper>
  		</Grid>
    );
  }
}

export default HomePage = withTheme(HomePage)
