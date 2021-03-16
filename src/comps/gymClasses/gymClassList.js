import firebase from "../../context/firebaseContext"


import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { withRouter } from "react-router-dom"

import
{Grid, Paper, Button, Typography, Collapse, IconButton, TextField,
InputBase, InputAdornment, TableBody, Table, TableCell, TableContainer,
  TableHead, TableRow }
from '@material-ui/core'

import SearchIcon from '@material-ui/icons/Search'
import { withTheme } from '@material-ui/core/styles'

import Delete from '@material-ui/icons/Delete'

import ActionCancelModal from "../actionCancelModal"
import { getGymClasses, removeGymClass } from '../../utils/firestore/gymClass'
import "../../styles.css"

const fs = firebase.firestore()

function GymClassRaw(props){
  let title = props.info["title"]
  let boxID = props.info["boxID"]
  let gymClassID = props.info["gymClassID"]

  return(
    <TableRow id={`class/${gymClassID}`} name="GymClassRow"
          onClick={(ev) => {props.onRowClick(ev, `/class/${boxID}/${gymClassID}`)} }>
      <TableCell align="left">
        <Typography variant="subtitle1" color="primary">
          { title }
        </Typography>
      </TableCell>
      <TableCell align="right">
        { props.isOwner ?
          <Button
            onClick={()=>{props.onRemove(props.info)}}>
            <Delete  color="error" />
          </Button>
        :
          <React.Fragment></React.Fragment>
        }
      </TableCell>
    </TableRow>
  )
}

const GymClass = withTheme(GymClassRaw)


function EmptyClassRaw(props){
  return(
    <TableRow>
      <TableCell colSpan={3} align="center">
        <Typography variant="subtitle1" color="primary">
          No Classes!
        </Typography>
      </TableCell>
    </TableRow>
  )
}
const EmptyClass = withTheme(EmptyClassRaw)



class GymClassList extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      isOwner: props.isOwner,
      boxID: props.boxID,
      filteredGymClasses:[],
      gymClasses: [],
      removeClass: {},
      openModal: false
    }
  }

  componentDidMount(){
    console.log(this.state)
    this.getGymClasses(this.state.boxID)
  }

  getGymClasses(boxID){
    if(boxID && ! this.gymClassListener){
      this.gymClassListener = getGymClasses(this.state.boxID)
      .onSnapshot(ss => {
        console.log(ss)
        if(!ss.empty){
          let classes = []
          ss.forEach(doc => {
            classes.push(doc.data())
          })
          this.setState({gymClasses: classes, filteredGymClasses: classes})
        }else{
          this.setState({gymClasses: [], filteredGymClasses: []})
        }
      },
      err => {console.log(err)})
    }
  }

  static getDerivedStateFromProps(props, state){
    return props
  }

  componentDidUpdate(){
    this.getGymClasses(this.state.boxID)
  }

  componentWillUnmount(){
    if(this.gymClassListener){
      this.gymClassListener()
    }
  }

  onKeyUp(data){
    if((data.keyCode || data.which) == 13){
    }
  }

  onChange(ev){
    let val = ev.target.value
    let filteredGymClasses = this.state.gymClasses.filter(gymClass =>{
      return gymClass["title"].toLowerCase().includes(val.toLowerCase())
    })
    this.setState({filteredGymClasses: filteredGymClasses})
  }

  onRowClick(ev, id){
    let tagName = ev.target.tagName
    if(["span", "svg", "path"].indexOf(tagName) < 0){
      console.log("pushed ", id)
      this.props.history.push(id)
    }
  }

  handleRemoveGymClass(){
    this.closeModal()
    if(!this.state.boxID && !this.state.removeClass.gymClassID){
      this.props.onAlert({type: "error", message: "Class info missing!"})
      return
    }
    removeGymClass(this.state.removeClass)
    .then((res) => {
      console.log(res)
      this.props.onAlert({type: "success", message: "Deleted class!"})
    })
    .catch(err => {console.log(err)})
  }

  onRemove(gymClass){
    this.setState({openModal: true, removeClass: gymClass})
  }

  closeModal(){
    this.setState({openModal: false})
  }

  render () {
    console.log(this.state.gymClasses)
    return (
      <Grid item xs={12}>
        <Grid item xs={12}>

          <Grid item xs={12} style={{margin: "0px 0px 8px 0px"}}>
            <Paper elevation={2} component="form">
              <TextField
                fullWidth
                  variant="outlined"
                  onKeyUp={this.onKeyUp.bind(this)}
                  onChange={this.onChange.bind(this)}
                  placeholder="Search Classes"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="primary" />
                      </InputAdornment>
                    )
                  }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Classes</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {this.state.filteredGymClasses.length > 0?
                  this.state.filteredGymClasses.map((gymClass, i) => {
                    return <GymClass
                            key={i}
                            info={gymClass}
                            onRemove={this.onRemove.bind(this)}
                            isOwner={this.props.isOwner}
                            onRowClick={this.onRowClick.bind(this)}
                            />
                  })
                :
                  <EmptyClass />
                }

                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <ActionCancelModal
          open={this.state.openModal}
          actionText="Remove"
          cancelText="Cancel"
          modalText={`Remove Class (${this.state.removeClass.title})?`}
          onAction={this.handleRemoveGymClass.bind(this)}
          onClose={this.closeModal.bind(this)}
        />
      </Grid>
    )
  }
}



export default GymClassList = withRouter(withTheme(GymClassList))
