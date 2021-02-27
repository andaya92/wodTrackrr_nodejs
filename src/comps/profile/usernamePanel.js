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
const usernameMaxLength = 12
const usernameMaxLengthErrMsg = "Username cannot be longer than 12 characters"
const usernameErrMsg = "Username can only contain letters & numbers" 

class UsernamePanel extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      showUpdate: false
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
        this.hideUpdate()     
        return 
      }

      setUsername(this.state.user.uid, usernameInput.value)
      .then((res) => {
        console.log(res)
        this.hideUpdate()
      })
      .catch(err => { console.log(err) })
    }
  }

  onKeyUp(data){
    if((data.keyCode || data.which) == 13){
        this.updateUsername()
    }
  }

  toggleUpdate(){
    this.setState({showUpdate: !this.state.showUpdate})
  }

  hideUpdate(){
    this.setState({showUpdate: false})
  }

  render () {    
    return (
    <Grid container id="usernamePanel" >
    {
      !this.state.userMD
      ? 
        <h1> Loading </h1>
      :
        <TableContainer>
            <Table>
              <TableBody>
              <TableRow>
                <TableCell>
                  Username
                </TableCell>
                <TableCell>
                  <Typography gutterBottom variant="h5">
                    {this.state.userMD.username} 
                  </Typography>  
                </TableCell>
                <TableCell>
                  <Button size="small" 
                    onClick={this.toggleUpdate.bind(this)}>
                    <Edit color="primary" />
                  </Button>
                </TableCell>
              </TableRow>
              {this.state.showUpdate ?
                <TableRow>
                  <TableCell colSpan={2}>
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
                  </TableCell>
                  
                  <TableCell align="right">
                    <Typography gutterBottom variant="h5">
                      <Button size="small" variant="outlined" color="primary" 
                          onClick={this.updateUsername.bind(this)}>
                          Update
                      </Button>
                    </Typography>  
                  </TableCell>
                </TableRow>
              :
                <React.Fragment></React.Fragment>
              }
              </TableBody>
            </Table>
        </TableContainer>
    }
    </Grid>
    );
  }
}

export default UsernamePanel = withTheme(UsernamePanel)