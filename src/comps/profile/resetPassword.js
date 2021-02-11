// Add the Firebase services that you want to use
import firebase from "../../context/firebaseContext"
import "firebase/auth"; 

import React, { Component } from 'react'
import { Grid, TextField, Button, Paper, Typography , Collapse } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import "../../css/login.css"

export default class ResetPassword extends Component {
   constructor(props){
    super(props)
    this.state = {
      user: props.user,
      alert: false,
      alertMsg: "",
      severity:""
    }

    if(this.state.user === null ){
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.setState({
            user: user
          })
        } 
      });
    }
  }

 

  handleSubmit(ev){

    let curPass = document.getElementById('currentPassword')
    let pass1 = document.getElementById('password')
    let pass2 = document.getElementById('passwordConfirm')
    
    console.log(pass1, pass2)
    
    if(pass1.value === pass2.value){

      let creds = firebase.auth.EmailAuthProvider.credential(
          this.state.user.email, 
          curPass.value
      );

      this.state.user.reauthenticateWithCredential(creds)
      .then(() => {
          this.state.user.updatePassword(pass1.value).then(() => {
            this.setState({
              alert: true,
              alertMsg: `Password reset Successfully`,
              severity: "success"
            })
            // this.props.onReset()
          }).catch((error) => {
            this.setState({
              alert: true,
              alertMsg: `Error resetting password`,
              severity: "error"
            })
          })

      }).catch((error) => {
        this.setState({
            alert: true,
            alertMsg: `Incorrect password`,
            severity: "error"
          })
      })
    }else{
       this.setState({
            alert: true,
            alertMsg: `New passwords do not match`,
            severity: "error"
          })
    }
  }


  render () {
    return (
      <React.Fragment id="resetPassword" >
      {
        !this.state.user
        ?
          <h1>Loading</h1>
        :
          <Paper elevation="2">
          <br />
          
          <Grid item xs={12} align="center">
            <Typography variant="h3">
              Change Password
            </Typography>
          </Grid>
          <br />
         <Grid item xs={12}>
            <Collapse in={this.state.alert}>
              <Alert severity={this.state.severity} onClose={() => {this.setState({alert: false})}}>
                {this.state.alertMsg}
              </Alert>
            </Collapse>
          </Grid>
         
           
           <Grid item xs={12} align="center">
           <TextField
              id="currentPassword"
              type="password"
              style={{ margin: 8 }}
              placeholder="Current Password"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <br/><br/>
           <TextField
              id="password"
              type="password"
              style={{ margin: 8 }}
              placeholder="Password"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
             <br/><br/>
            </Grid>

            <Grid item xs={12} align="center">
              <TextField
              id="passwordConfirm"
              type="password"
              style={{ margin: 8 }}
              placeholder="Confirm Password"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            /> <br/><br/>
            </Grid>

            <Grid item xs={12} align="center">
              <Button variant="outlined" color="primary" onClick={this.handleSubmit.bind(this)}>
                Change Password
              </Button>
            </Grid>
          </Paper>
      }
      </React.Fragment>
    );
  }
}



