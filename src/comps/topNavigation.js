import firebase from "../context/firebaseContext"
import "firebase/firestore"

import React, { Component } from 'react'
import { Grid, TextField, Button, Typography, TableBody, Table, TableCell, TableContainer,
          TableHead, TableRow, Tabs, Tab, AppBar }
from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';

import { withTheme } from '@material-ui/core/styles'
import BoxListAccordion from "./boxes/boxListAccordion"
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

class NewOwnerBox extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      userBoxes: [],
      hasBoxes: false,
      addBoxProgress: true,
      value: 0
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

  a11yProps(index) {
		return {
		  id: `ownerbox-tab-${index}`,
		  'aria-controls': `simple-tabpanel-${index}`,
		}
	}

  handleChange(ev, value){
  	this.setState({value: value})
  }
  handleChangeIndex(value){
  	this.setState({value: value})
  }

  render () {
    return (
    	<Grid item xs={12} id="ownerBox" >
    	<AppBar position="static">
        <Tabs value={this.state.value} variant="fullWidth" selectionFollowsFocus
        		onChange={this.handleChange.bind(this)} aria-label="simple tabs example">
          <Tab label="Add Gym" {...this.a11yProps(0)} />
          <Tab label="Add Class" {...this.a11yProps(1)} />
          <Tab label="Add Workout" {...this.a11yProps(2)} />
          <Tab label="View Gyms" {...this.a11yProps(3)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={this.props.theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={this.state.value}
        onChangeIndex={this.handleChangeIndex.bind(this)}
      >
	      <TabPanel value={this.state.value} index={0}>
				  	<AddBox 
				  		user = {this.state.user}
							userMD = {this.state.userMD}
				  	/>
	      </TabPanel>
        <TabPanel value={this.state.value} index={1}>
            <AddGymClass 
              user = {this.state.user}
              userMD = {this.state.userMD}
              userBoxes = {this.state.userBoxes}
              hasBoxes = {this.state.hasBoxes}
            />
        </TabPanel>
	      <TabPanel value={this.state.value} index={2}>
	        	<AddWod
	          	uid={this.state.user.uid}
	          	userMD={this.state.userMD}
	          	userBoxes = {this.state.userBoxes}
							hasBoxes = {this.state.hasBoxes}
	          />
	      </TabPanel>
	      <TabPanel value={this.state.value} index={3}>
				  	<BoxListAccordion 
				  		user = {this.state.user}
							userMD = {this.state.userMD}
							userBoxes = {this.state.userBoxes}
							hasBoxes = {this.state.hasBoxes}
				  	/>
	      </TabPanel>
	     </SwipeableViews>
  		</Grid>
    )
  }
}




export default withTheme(NewOwnerBox);