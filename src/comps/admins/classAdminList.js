import React, { Component } from 'react'

import{
  Grid, Paper, Button, Typography, TextField, InputAdornment,
  TableBody, Table, TableCell, TableContainer, TableHead, TableRow
}from '@material-ui/core'

import Delete from '@material-ui/icons/Delete'
import SearchIcon from '@material-ui/icons/Search'
import { withTheme } from '@material-ui/core/styles'

import ActionCancelModal from "../actionCancelModal"
import { removeAdmin } from '../../utils/firestore/classAdmin'
import "../../styles.css"

function AdminRowRaw(props){
  console.log(props)
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
            onClick={()=>{props.handleRemoveAdmin(props.info)}}>
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

function EmptyAdminRaw(props){
  return(
    <TableRow>
      <TableCell colSpan={3} align="center">
        <Typography variant="subtitle1" color="primary">
          No Admins!
        </Typography>
      </TableCell>
    </TableRow>
  )
}
const EmptyAdmin = withTheme(EmptyAdminRaw)

class ClassAdminList extends Component {
  constructor(props){
    super(props)
    this.state = {
        gymClassID: props.gymClassID,
        isOwner: props.isOwner,
        filteredAdmins: props.filteredAdmins,
        admins: props.admins,
        showRemoveAlert: false,
        removeClassAdmin: {}
    }
  }

  componentDidMount(){
  }

  static getDerivedStateFromProps(props, state){
    return state.admins.length > 0? state : props
  }

  onKeyUp(data){
    if((data.keyCode || data.which) === 13){
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

  handleRemoveAdmin(removeClassAdmin){
    console.log("remove admin w/ data: ", removeClassAdmin)
    this.setState({removeClassAdmin: removeClassAdmin, showRemoveAlert: true})
  }

  onRemoveAdmin(){
    this.setState({showRemoveAlert: false})
    console.log(this.state.removeClassAdmin)
    removeAdmin(this.state.removeClassAdmin)
    .then((res) => {
			this.props.onAlert({
				type: "success",
				message: "Removed admin!"
			})
		})
		.catch(err => {
			this.props.onAlert({
				type: "error",
				message: err.message
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
                {this.state.filteredAdmins.length > 0 ?
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
                :
                  <EmptyAdmin />
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
          onAction={this.onRemoveAdmin.bind(this)}
          modalText={ `Remove admin: ${this.state.removeClassAdmin.username}?`}
          actionText={"Remove"}
          cancelText={"Cancel"}
			/>
      </Grid>
    );
  }
}



export default ClassAdminList = withTheme(ClassAdminList)
