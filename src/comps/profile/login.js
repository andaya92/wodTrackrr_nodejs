import firebase from "../../context/firebaseContext"
// import * as firebase from "firebase/app";
import "firebase/auth";

import { withRouter } from "react-router-dom";


import React, { Component } from 'react'
import { Grid, TextField, Button, Typography, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';


import "../../styles.css"


class Login extends Component {

  handleSubmit(ev){
    let email = document.getElementById('email')

    let pass1 = document.getElementById('password')
    let pass2 = document.getElementById('passwordConfirm')

    console.log(email.value, pass1)

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

  render () {
    return (
      <Grid container id="login" align="center" justify="center">
        <br />
        <Grid item xs={12} >
          <Paper elevation={2}>
            <Typography variant="h4">
              Login
            </Typography>

            <br />

            <TextField
            id="email"
            style={{ margin: 8 }}
            placeholder="Email"
            margin="normal"
            InputLabelProps={{
            shrink: true,
            }}
            /><br /><br />
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
          </Paper>
        </Grid>

        <Grid item xs={12} >
          <Paper elevation={2}>
            <Button variant="outlined" color="primary" onClick={this.handleSubmit.bind(this)}>
              Login
            </Button>
            <Link to="/register" className="no-line" style={{'paddingLeft': '10px'}}>
              <Button variant="outlined" color="secondary" >
                Register
              </Button>
            </Link>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}



export default Login = withRouter(Login)