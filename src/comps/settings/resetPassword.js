import firebase from "../../context/firebaseContext"
import "firebase/auth";

import React, { Component } from 'react'
import {
  Grid, TextField, Button, Paper, Typography
} from '@material-ui/core';

import { withTheme } from '@material-ui/core/styles';

class ResetPassword extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  }

  static getDerivedStateFromProps(props, state){
    return state.user? state: props
  }

  handleSubmit(ev){
    let currentPassword = this.state.currentPassword
    let newPassword = this.state.newPassword
    let confirmPassword = this.state.confirmPassword

    console.log(this.state)
    console.log(currentPassword, newPassword, confirmPassword)

    if(newPassword === confirmPassword){

      let creds = firebase.auth.EmailAuthProvider.credential(
        this.state.user.email,
        currentPassword
      );

      this.state.user.reauthenticateWithCredential(creds)
      .then(() => {
        this.state.user.updatePassword(newPassword)
        .then((res) => {
          console.log("Changed password.")

        }).catch((err) => {
          console.log(err)
        })

      }).catch((err) => {
        console.log(err)
        console.log("Incorrect password.")
      })
    }else{
      console.log(`New passwords do not match.`)
    }
  }


  onChange(ev){
    const  { name, value } = ev.target
    this.setState({[name]: value})
  }

  render () {
    return (
      <React.Fragment>
        {this.state.user?
          <Grid
            xs={12} item container
            direction="column" align="center"
            alignItems="center" justify="center"
            style={{marginBottom: "16px"}}
          >
          <Grid item>
            <Grid item xs={12} align="center" style={{marginBottom: "16px"}}>
              <Typography variant="h3">
                Change Password
              </Typography>
            </Grid>

            <Grid item xs={12} align="center">
              <TextField
                  id="currentPassword"
                  type="password"
                  name="currentPassword"
                  onChange={this.onChange.bind(this)}
                  style={{ margin: 8 }}
                  label="Current Password"
                  margin="normal"
                />
            </Grid>
            <Grid item xs={12} align="center">
              <TextField
                  id="password"
                  type="password"
                  name="newPassword"
                  color="primary"
                  onChange={this.onChange.bind(this)}
                  style={{ margin: 8 }}
                  label="New Password"
                  margin="normal"
                />
            </Grid>
            <Grid item xs={12} align="center">
              <TextField
                id="passwordConfirm"
                name="confirmPassword"
                onChange={this.onChange.bind(this)}
                type="password"
                style={{ margin: 8 }}
                label="Confirm Password"
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} align="center" style={{margin: "16px 0px 16px 0px"}}>
              <Button variant="outlined" color="primary" onClick={this.handleSubmit.bind(this)}>
                Change Password
              </Button>
            </Grid>
          </Grid>
        </Grid>
      :
        <h1>Loading</h1>
      }
    </React.Fragment>
    )
  }
}



export default ResetPassword = withTheme(ResetPassword)