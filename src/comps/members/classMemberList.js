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
import { removeMember } from '../../utils/firestore/classMember'
import "../../styles.css"

const fs = firebase.firestore()

function MemberRowRaw(props){
  
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
            onClick={()=>{props.handleRemoveMember(props.info.classMemberID, props.info.username)}}>
            <Delete  color="error" />
          </Button>
        :
          <React.Fragment></React.Fragment>
        }
      </TableCell>
    </TableRow>
  )
}
const MemberRow = withTheme(MemberRowRaw)

class ClassMemberList extends Component {
  constructor(props){
    super(props)
    this.state = {
        gymClassID: props.gymClassID,
        isOwner: props.isOwner,
        filteredMembers: props.filteredMembers,
        members: props.members,
        showRemoveAlert: false,
        removeUsername: "",
        classMemberID: ""
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
    let filteredMembers = this.state.members.filter(member =>{
        return member["username"].toLowerCase().includes(val.toLowerCase())
    })
    this.setState({filteredMembers: filteredMembers})
  }

  handleModalClose(){
    this.setState({showRemoveAlert: false})
  }

  handleRemoveMember(classMemberID, username){
    this.setState({classMemberID: classMemberID, removeUsername: username, showRemoveAlert: true})
  }
  
  onRemoveMember(){
    removeMember(this.state.classMemberID)
    .then(() => { 
      console.log("Removed member.") 
      this.setState({showRemoveAlert: false})
    })
    .catch(err => { console.log(err) })

  }

  render () {
    return (
      <Grid item xs={12}>
        <Grid item xs={12}>
          {this.state.members.length > 0 ?
          <Grid item xs={12} style={{margin: "0px 0px 8px 0px"}}>
          <Paper elevation={2} component="form">
            <TextField
                fullWidth
                variant="outlined"
                inputProps={{style: {fontSize: "0.8em"}}}
                onKeyUp={this.onKeyUp.bind(this)}
                onChange={this.onChange.bind(this)}
                placeholder="Search Members"
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
                    <TableCell>Member Username</TableCell>
                    <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {
                this.state.filteredMembers.map((member, i) => {
                    return (
                        <MemberRow 
                            key={i} 
                            info={member} 
                            handleRemoveMember={this.handleRemoveMember.bind(this)}
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
            <Typography>No members</Typography>
          }
        </Grid>
        <ActionCancelModal
				  open={this.state.showRemoveAlert}
          onClose={this.handleModalClose.bind(this)}
          onAction={this.onRemoveMember.bind(this)}
          modalText={ `Remove member, ${this.state.removeUsername}?`}
          actionText={"Remove"}
          cancelText={"Cancel"}
			/>
      </Grid>
    );
  }
}



export default ClassMemberList = withTheme(ClassMemberList)
