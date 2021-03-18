import React, { Component } from 'react'
import { Grid, TextField, Button, Typography, TableBody, Table, TableContainer,
          TableHead, TableRow }
from '@material-ui/core';
import {TableCell as TC} from '@material-ui/core';
import { withTheme, withStyles } from '@material-ui/core/styles'

import Edit from '@material-ui/icons/Edit'
import { setUsername } from '../../utils/firestore/users'
import "../../styles.css"


const TableCell = withStyles({root:{
  borderBottom: "none"
}})(TC)
const USERNAME_MAX_LEN = 12
const USERNAME_MAX_LENGTH_ERR_MSG = "Username cannot be longer than 12 characters"
const USERNAME_ERR_MSG = "Username can only contain letters & numbers"

class UsernamePanel extends Component {

  constructor(props){
    super(props)
    this.state = {
      userMD: props.userMD
    }
  }

  static getDerivedStateFromProps(props, state){

    return props
  }

  updateUsername(ev){
    let usernameInput = document.getElementById('updateUsernameInput')

    if(usernameInput.style.display === "none"){
      usernameInput.style.display = "block"
    }else{
      let re = /\W/g  // match non word characters ^[A-Za-z0-9]

      if(usernameInput.value.length > USERNAME_MAX_LEN){
        this.props.onAlert({
          type: "warning",
          message: USERNAME_MAX_LENGTH_ERR_MSG
        })
        return
      }
      if(re.exec(usernameInput.value) !== null ){
        this.props.onAlert({
          type: "warning",
          message: USERNAME_ERR_MSG
        })
        return
      }
      if(usernameInput.value.length <= 0){
        return
      }

      setUsername(this.state.userMD.uid, usernameInput.value)
      .then((res) => {
        console.log(res)
      })
      .catch(err => { console.log(err) })
    }
  }

  onKeyUp(data){
    if((data.keyCode || data.which) == 13){
        this.updateUsername()
    }
  }



  render () {
    return (
    <Grid container id="usernamePanel" >
    {
      !this.state.userMD
      ?
        <h1> Loading </h1>
      :
      <Grid item container align="center" xs={12}>
        <Grid item xs={12}>
          <Typography variant="h5" color="primary">
              {this.state.userMD.username}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="updateUsernameInput"
            type="text"

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
        <Grid item xs={12} style={{marginTop: "8px"}}>
          <Button size="small" variant="outlined" color="primary"
              onClick={this.updateUsername.bind(this)}>
              Update
          </Button>
        </Grid>
      </Grid>
    }
    </Grid>
    );
  }
}

export default UsernamePanel = withTheme(UsernamePanel)