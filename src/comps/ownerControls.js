import firebase from "../context/firebaseContext"
import "firebase/firestore"

import React, { Component } from 'react'
import { Grid, TextField, Button, Typography, TableBody, Table, TableCell, TableContainer,
          TableHead, TableRow, Tabs, Tab, AppBar }
from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';

import { withTheme } from '@material-ui/core/styles'
import OwnerBoxes from "./boxes/ownerBoxes"
import AddGymClass from "./gymClasses/addGymClass"
import AddWod from "./wods/addWod"
import AddBox from "./boxes/addBox"

let fs = firebase.firestore()

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Grid item xs={12}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Grid item xs={12}>
          {children}
        </Grid>
      )}
    </Grid>
  );
}

class OwnerControls extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      userBoxes: [],
      hasBoxes: false,
      addBoxProgress: true,
      index: 0,
      tabs: {
        0: "show",
        1: "hide",
        2: "hide",
        3: "hide"
      }
    }
    console.log(props)
  }

  componentDidMount(){
  	this.listenForBoxes()
  }

  static getDerivedStateFromProps(props, state){
	  return props
  }

  componentDidUpdate(){
    if(this.state.userMD.accountType === "owner"){
      this.listenForBoxes()
    }

  }

  componentWillUnmount(){
    if(this.boxListener){
      this.boxListener()
    }
  }

  listenForBoxes(){
  	if(!this.state.user || this.boxListener)
  		return

		this.boxListener = fs.collection("boxes").where("uid", "==", this.state.user.uid)
		.onSnapshot(ss => {
			let data = []
			ss.forEach(doc => {
				data.push(doc.data())
			})
      console.log("Setting new state for userBoxes")
			this.setState({
				hasBoxes: true,
				userBoxes: data
			})
		},
		err => {
  		this.setState({
				hasBoxes: false,
				userBoxes: []
			})
		})
  }


  handleChange(ev, index){
    console.log(index)
    this.state.tabs[this.state.index] = "hide"
    this.state.tabs[index] = "show"
  	this.setState({index: index, tabs: this.state.tabs})
  }
  handleChangeIndex(index){
  	this.setState({index: index})
  }

  render () {
    console.log(this.state)
    return (
    	<Grid item xs={12} id="ownerBox" >
    	<AppBar position="static">
        <Tabs value={this.state.index} variant="fullWidth" selectionFollowsFocus
        		onChange={this.handleChange.bind(this)} aria-label="simple tabs example">
          <Tab label="View Gyms"/>
          <Tab label="Add Workout" />
          <Tab label="Add Class" />
          <Tab label="Add Gym" />
        </Tabs>
      </AppBar>
      <Grid item xs={12} style={{minHeight: "50vh", maxHeight: "150vh", overflowY: "scroll"}}>
          {this.state.hasBoxes?
            <React.Fragment>
              <Grid item xs={12} className={`${this.state.tabs[0]} slide-left`}>
                <OwnerBoxes
                  user = {this.state.user}
                  userMD = {this.state.userMD}
                  userBoxes = {this.state.userBoxes}
                  hasBoxes = {this.state.hasBoxes}
                  onAlert={this.props.onAlert}
                />
              </Grid>
              <Grid item xs={12} className={`slide-left ${this.state.tabs[1]}`}>
                  <AddWod
                    isOwnerView={true}
                    userMD={this.state.userMD}
                    userBoxes = {this.state.userBoxes}
                    hasBoxes = {this.state.hasBoxes}
                    onAlert={this.props.onAlert}
                  />
              </Grid>
              <Grid item xs={12} className={`slide-right ${this.state.tabs[2]}`}>
                  <AddGymClass
                    userMD = {this.state.userMD}
                    userBoxes = {this.state.userBoxes}
                    hasBoxes = {this.state.hasBoxes}
                    onAlert={this.props.onAlert}
                  />
              </Grid>
            </React.Fragment>
          :
            <React.Fragment></React.Fragment>
          }
	      <Grid item xs={12} className={`slide-right ${this.state.tabs[3]}`}>
				  	<AddBox
							userMD = {this.state.userMD}
              onAlert={this.props.onAlert}
              />
	      </Grid>
      </Grid>

  		</Grid>
    )
  }
}




export default withTheme(OwnerControls);