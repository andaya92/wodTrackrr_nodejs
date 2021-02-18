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

import SearchIcon from '@material-ui/icons/Search'
import { withTheme } from '@material-ui/core/styles'

import Delete from '@material-ui/icons/Delete'
import { getGymClasses, removeGymClass } from '../../utils/firestore/gymClass'
import "../../styles.css"

const fs = firebase.firestore()

function GymClassRaw(props){
  let title = props.info["title"]
  let boxID = props.info["boxID"]
  let gymClassID = props.info["gymClassID"]
  // TODO redirect to wods whhoch is what boxView is
  return(
    <TableRow id={`class/${gymClassID}`} name="GymClassRow" 
          onClick={(ev) => {props.onRowClick(ev, `/class/${gymClassID}`)} }> 
      <TableCell align="left">
        <Typography variant="subtitle" color="primary">
          { title }
        </Typography>
      </TableCell>
      <TableCell align="right">
        { props.isOwner ?
          <Button
            onClick={()=>{props.handleRemoveGymClass(gymClassID)}}>
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

class GymClassList extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      isOwner: props.isOwner,
      boxID: props.boxID,
      redirect: false,
      redirectTo: "",
      filteredGymClasses:[],
      gymClasses: []
    }
  }

  componentDidMount(){
    this.getGymClasses(this.state.boxID)
  }

  getGymClasses(boxID){
    if(!boxID)
      return
    getGymClasses(this.state.boxID)
    .onSnapshot(ss => {
      if(!ss.empty){
        let classes = []
        ss.forEach(doc => {
          classes.push(doc.data())
        })
        this.setState({gymClasses: classes, filteredGymClasses: classes})
        // this.setClickListeners()
      }else{
        this.setState({gymClasses: [], filteredGymClasses: []})
      }
    },
    err => {console.log(err)})
  }

  

  handleRemoveGymClass(gymClassID){
      console.log("remove class", gymClassID)
  }

  componentWillReceiveProps(newProps){
    this.setState({...newProps})
    this.getGymClasses(newProps.boxID)

    
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
    if(ev.target.tagName === "TD"){
      this.setState({redirect: true, redirectTo: id})
    }
  }

  handleRemoveGymClass(gymClassID){
    removeGymClass(gymClassID)
    .then((res) => {
      console.log(res)
    })
    .catch(err => {console.log(err)})
  }

  render () {
    return (
      <Grid item xs={12}>
        {this.state.redirect ?
          <Redirect to={this.state.redirectTo} />
        :
          <React.Fragment></React.Fragment>
        }
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
    {
      this.state.filteredGymClasses.map((gymClass, i) => {
        return <GymClass 
                key={i} 
                info={gymClass} 
                handleRemoveGymClass={this.handleRemoveGymClass.bind(this)}
                isOwner={this.props.isOwner}
                onRowClick={this.onRowClick.bind(this)}
                />
      })
    }
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    );
  }
}



export default GymClassList = withTheme(GymClassList)
