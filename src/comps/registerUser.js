import React, { Component } from 'react'
import { Grid, TextField, Button } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import firebase from "../context/firebaseContext"
import "firebase/auth";
import "firebase/database"; 

import postData from "../utils/api"


import "../css/login.css"


var db = firebase.database();

export default class RegisterUser extends Component {
  constructor(props){
    super(props)
    this.state = {redirect: false}
  }

  componentDidMount(){
  }

 

  handleSubmit(ev){
    let email = document.getElementById('email')

    let pass1 = document.getElementById('password')
    let pass2 = document.getElementById('passwordConfirm')
    
    console.log(email.value, pass1)
    

    if(pass1.value === pass2.value){
      firebase.auth().createUserWithEmailAndPassword(email.value, pass1.value)
      .then(res => {


        db.ref(`users/${res.user.uid}/`).update({
          "username": "New User",
          "customerID": false,
          "admin": false,
          "sub_website": false,
          "sub_snapchat": false,
          "sub_ig": false
        })
        .then( () => {
          // set user claims to false
          postData('/unregisterSubscribedUser', {uid: res.user.uid})
          .then(() => {
            this.setState({redirect: true})
          })
        })


      })
      .catch(function(error) {
        console.log(error)
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        // ...
      });
    }else{
      alert("Passwords do not match")
    }



    // firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    //   // Handle Errors here.
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   // ...
    // });

  }

  // <!-- TODO: Add SDKs for Firebase products that you want to use
  //      https://firebase.google.com/docs/web/setup#available-libraries -->

  render () {
    return (
      <React.Fragment>
      {
        this.state.redirect
            ? <Redirect to="/" />
            : <Grid container id="login" align="center" justify="center">
              <br />
              <Grid item xs={12} ><h1>Register</h1></Grid>
              <br />
      
              <Grid item xs={12} >
               
               <TextField
                id="email"
                style={{ margin: 8 }}
                placeholder="Email"
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              /><br /><br />
              </Grid>
               
               <Grid item xs={12} >
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
      
                <Grid item xs={12} >
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
      
                <Grid item xs={12} >
                  <Button variant="outlined" color="primary" onClick={this.handleSubmit.bind(this)}>
                    Submit
                  </Button>
                  
                  
                </Grid>
            </Grid>
        }
        </React.Fragment>
    );
  }
}



