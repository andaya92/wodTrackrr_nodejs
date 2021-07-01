import React, { Component } from 'react'
import { Grid, TextField, Button, Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles'

import { setUsername } from '../../utils/firestore/users'
import "../../styles.css"

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
    if((data.keyCode || data.which) === 13){
        this.updateUsername()
    }
  }



  render () {
    return (
    <Grid item xs={12}>
    {
      !this.state.userMD
      ?
        <h1> Loading </h1>
      :
      <Grid
        xs={12} item container
        direction="column" align="center"
        alignItems="center" justify="center"
        style={{height: "25vh"}}
      >
        <Grid item>
          <Grid item xs={12} align="center" style={{marginBottom: "60px"}}>
            <Typography variant="h3">
              Change Username
            </Typography>
          </Grid>
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
          <Grid item xs={12} style={{marginTop: "8px", marginBottom: "8px"}}>
            <Button size="small" variant="outlined" color="primary"
                onClick={this.updateUsername.bind(this)}>
                Update
            </Button>
          </Grid>

        </Grid>
      </Grid>
    }
    </Grid>
    )
  }
}

export default UsernamePanel = withTheme(UsernamePanel)