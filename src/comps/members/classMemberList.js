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
            onClick={()=>{props.handleRemoveMember(props.info)}}>
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

function EmptyMemberRaw(props){
  return(
    <TableRow>
      <TableCell colSpan={3} align="center">
        <Typography variant="subtitle1" color="primary">
          No Members!
        </Typography>
      </TableCell>
    </TableRow>
  )
}
const EmptyMember = withTheme(EmptyMemberRaw)

class ClassMemberList extends Component {
  constructor(props){
    super(props)
    this.state = {
        gymClassID: props.gymClassID,
        isOwner: props.isOwner,
        filteredMembers: props.filteredMembers,
        members: props.members,
        showRemoveAlert: false,
        classMember: ""
    }
  }

  componentDidMount(){
  }

  static getDerivedStateFromProps(props, state){
    return state.members.length > 0? state : props
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

  handleRemoveMember(classMember){
    this.setState({classMember: classMember, showRemoveAlert: true})
  }

  onRemoveMember(){
    this.setState({showRemoveAlert: false})
    console.log("Remvoing")
    console.log(this.state.classMember)
    removeMember(this.state.classMember)
    .then((res) => {
			this.props.onAlert({
				type: "success",
				message: "Removed member!"
			})
		})
		.catch(err => {
			this.props.onAlert({
				type: "error",
				message: err
			})
		})

  }

  render () {
    return (
      <Grid item xs={12}>
        <Grid item xs={12}>
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
                {this.state.filteredMembers.length > 0 ?
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
                :
                  <EmptyMember />
                }
                </TableBody>
                </Table>
            </TableContainer>
          </Paper>
          </Grid>
        </Grid>
        <ActionCancelModal
				  open={this.state.showRemoveAlert}
          onClose={this.handleModalClose.bind(this)}
          onAction={this.onRemoveMember.bind(this)}
          modalText={ `Remove member, ${this.state.classMember.username}?`}
          actionText={"Remove"}
          cancelText={"Cancel"}
			/>
      </Grid>
    );
  }
}



export default ClassMemberList = withTheme(ClassMemberList)
