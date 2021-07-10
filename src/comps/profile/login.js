import firebase from "../../context/firebaseContext"
// import * as firebase from "firebase/app";
import "firebase/auth";

import { withRouter } from "react-router-dom";


import React, { Component } from 'react'
import { Grid, TextField, Button, Typography, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';


import "../../styles.css"


class Login extends Component {

  constructor(props){
    super(props)
    this.state = {
      userMD: props.userMD
    }
  }

  handleSubmit(ev){
    let email = document.getElementById('email')
    let pass1 = document.getElementById('password')

    firebase.auth().signInWithEmailAndPassword(email.value, pass1.value)
    .then(res=>{
      this.props.onLogin(res.user)
      this.props.history.push("/boxSearch")
    })
    .catch((error) => {
      this.props.onAlert({
        type: "warning",
        message: error.message
      })
    });
  }

  linkTo(url){
    this.props.history.push(url)
  }

  render () {
    return (
      <Grid container id="login" align="center" justify="center">
        <Grid item xs={12} style={{top: "20%", position: "absolute"}}>
          <Typography variant="h4">
            Login
          </Typography>

          <br />

          <TextField
            id="email"
            style={{ margin: 8 }}
            label="Email"
            margin="normal"
          />
          <br /><br />
          <TextField
            id="password"
            type="password"
            style={{ margin: 8 }}
            label="Password"
            margin="normal"
          />
          <br/><br/>
          <Grid item container align="center">
            <Grid item xs={6}>
              <Button
                variant="outlined"
                color="primary"
                onClick={this.handleSubmit.bind(this)}>
                Login
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => this.linkTo("/register")}>
                Register
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}



export default Login = withRouter(Login)