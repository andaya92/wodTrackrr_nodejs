// Add the Firebase services that you want to use
import firebase from "../context/firebaseContext"
import "firebase/auth"; 
import "firebase/database"; 

import React, { Component } from 'react'
import { Grid, TextField, Button, Typography } from '@material-ui/core';

import postData from "../utils/api"
import "../styles.css"

var db = firebase.database();

const usernameMaxLength = 12
const usernameMaxLengthErrMsg = "Username cannot be longer than 12 characters"
const usernameErrMsg = "Username can only contain letters & numbers" 


export default class UsernamePanel extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD
    }
  }


  componentWillReceiveProps(newProps){
    this.setState({...newProps})
  }


componentDidMount(){
  this.hideUsernameInput()
}
componentDidUpdate(){
  this.hideUsernameInput()
}


  // <!-- TODO: Add SDKs for Firebase products that you want to use
  //      https://firebase.google.com/docs/web/setup#available-libraries -->

  updateUsername(ev){
    let usernameInput = document.getElementById('updateUsernameInput')
    

    if(usernameInput.style.display === "none"){
      usernameInput.style.display = "block"

    }else{

      let re = /\W/g  // match non word characters ^[A-Za-z0-9]
    
      if(usernameInput.value.length > 12){
        alert(usernameMaxLengthErrMsg)
        return
      } 
      if(re.exec(usernameInput.value) !== null ){
        alert(usernameErrMsg)
        return
      }
      //update 
      if(usernameInput.value.length <= 0){ 
        this.hideUsernameInput()     
        return 
      }

      db.ref(`users/${this.state.user.uid}/`)
      .update({
        "username": usernameInput.value
      })
      .then(() => {
       this.hideUsernameInput()
      })
      .catch(err => { console.log(err) })
    }
  }

  onKeyUp(data){
    if((data.keyCode || data.which) == 13){
        this.updateUsername()
    }
  }

  hideUsernameInput(){
    try{
      let usernameInput = document.getElementById('updateUsernameInput')
      usernameInput.value = ""
      usernameInput.style.display = "none"
    }catch{return}
  }

  render () {
    
    return (
    <Grid container id="usernamePanel" >
    {
      !this.state.userMD
      ? 
        <h1> Loading </h1>
      :
        <React.Fragment>
          <Grid item xs={12} >
            <Typography gutterBottom variant="h4">
              Username
            </Typography>
            <Typography gutterBottom variant="h5">
              {this.state.userMD.username}
            </Typography>
          </Grid>

          <Grid item xs={12} >
            <Button  
                variant="outlined" 
                color="primary" 
                onClick={this.updateUsername.bind(this)}
            >
              <Typography>
                  Update Username
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={12} >
            <TextField
              id="updateUsernameInput"
              type="text"
              style={{ margin: 8}}
              pattern="[A-Za-z]{12}"
              inputProps={{
                title: "Letters only, max length 12",
                placeholder: "New username"
              }}
              onKeyUp={this.onKeyUp.bind(this) }
              margin="normal"
              color="primary"
              InputLabelProps={{
                shrink: true,
              }}
            />    
          </Grid>
        </React.Fragment>
    }
    </Grid>
    );
  }
}



