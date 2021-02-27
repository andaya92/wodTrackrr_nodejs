import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/database"; 

import React, { Component } from 'react'
import { Route, Link, Redirect } from 'react-router-dom';

import 
{Grid, Paper, Button, Typography, Collapse, IconButton, TextField,
InputBase, InputAdornment, TableBody, Table, TableCell, TableContainer,
  TableHead, TableRow }
from '@material-ui/core'

import Delete from '@material-ui/icons/Delete'
import SearchIcon from '@material-ui/icons/Search'
import { withTheme } from '@material-ui/core/styles'

import ActionCancelModal from "../actionCancelModal"
import { removeAdmin } from '../../utils/firestore/classAdmin'
import "../../styles.css"

const fs = firebase.firestore()

function AdminRowRaw(props){
  
  // TODO redirect to wods whhoch is what boxView is
  return(
    <TableRow> 
      <TableCell align="left">
        <Typography variant="subtitle1" color="primary">
          { props.info.username }
        </Typography>
      </TableCell>
      <TableCell align="right">
        { props.isOwner ?
          <Button
            onClick={()=>{props.handleRemoveAdmin(props.info.classAdminID, props.info.username)}}>
            <Delete  color="error" />
          </Button>
        :
          <React.Fragment></React.Fragment>
        }
      </TableCell>
    </TableRow>
  )
}
const AdminRow = withTheme(AdminRowRaw)

class ClassAdminList extends Component {
  constructor(props){
    super(props)
    this.state = {
        gymClassID: props.gymClassID,
        isOwner: props.isOwner,
        filteredAdmins: props.filteredAdmins,
        admins: props.admins,
        showRemoveAlert: false,
        removeUsername: "",
        removeClassAdminID: ""
    }
  }

  componentDidMount(){
  }

  static getDerivedStateFromProps(props, state){
    return props  
  }

  onKeyUp(data){
    if((data.keyCode || data.which) == 13){   
    }
  }


  onChange(ev){
    let val = ev.target.value
    let filteredAdmins = this.state.admins.filter(admin =>{
        return admin["username"].toLowerCase().includes(val.toLowerCase())
    })
    this.setState({filteredAdmins: filteredAdmins})
  }

  handleModalClose(){
    this.setState({showRemoveAlert: false})
  }

  handleRemoveAdmin(classAdminID, username){
    console.log("remove member w/ uid: ", classAdminID)
    this.setState({removeClassAdminID: classAdminID, removeUsername: username, showRemoveAlert: true})
  }
  
  onRemoveAdmin(){
    removeAdmin(this.state.removeClassAdminID)
    .then(() => { 
      console.log("Removed admin.") 
      this.setState({showRemoveAlert: false})
    })
    .catch(err => { console.log(err) })

  }

  

  render () {
    return (
      <Grid item xs={12}>
        <Grid item xs={12}>
          {this.state.admins.length > 0 ?
          <Grid item xs={12} style={{margin: "0px 0px 8px 0px"}}>
          <Paper elevation={2} component="form">
            <TextField
                fullWidth
                variant="outlined"
                inputProps={{style: {fontSize: "0.8em"}}}
                onKeyUp={this.onKeyUp.bind(this)}
                onChange={this.onChange.bind(this)}
                placeholder="Search Admins"
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon color="primary" />
                    </InputAdornment>
                    )
                }}
            />
            <TableContainer>
                <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                    <TableCell>Admin Username</TableCell>
                    <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {
                this.state.filteredAdmins.map((admin, i) => {
                    return (
                        <AdminRow 
                            key={i} 
                            info={admin} 
                            handleRemoveAdmin={this.handleRemoveAdmin.bind(this)}
                            isOwner={this.props.isOwner}
                        />
                    )
                })
                }
                </TableBody>
                </Table>
            </TableContainer>
          </Paper>
          </Grid>

          :
            <Typography>No admins</Typography>
          }
        </Grid>
        <ActionCancelModal
				  open={this.state.showRemoveAlert}
          onClose={this.handleModalClose.bind(this)}
          onAction={this.onRemoveAdmin.bind(this)}
          modalText={ `Remove admin, ${this.state.removeUsername}?`}
          actionText={"Remove"}
          cancelText={"Cancel"}
			/>
      </Grid>
    );
  }
}



export default ClassAdminList = withTheme(ClassAdminList)
