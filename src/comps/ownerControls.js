import firebase from "../context/firebaseContext"
import "firebase/firestore"

import React, { Component } from 'react'
import { Grid, Tabs, Tab, AppBar } from '@material-ui/core';

import { withTheme } from '@material-ui/core/styles'
import OwnerBoxes from "./boxes/ownerBoxes"
import AddGymClass from "./gymClasses/addGymClass"
import AddWod from "./wods/addWod"
import AddBox from "./boxes/addBox"
import { setGymClass } from "../utils/firestore/gymClass"

let fs = firebase.firestore()

class OwnerControls extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      userBoxes: [],
      hasBoxes: false,
      index: 0,
      addClassBoxIndex: 0,
      addClassClassInfo: {title: "", description: "", isPrivate: false},
      tabs: {
        0: "show",
        1: "hide",
        2: "hide",
        3: "hide"
      }
    }
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
			let data = this.state.userBoxes
      let newAddClassBoxIndex = this.state.addClassBoxIndex

      ss.docChanges().forEach(change => {
        if(change.type === "added"){
          data.splice(change.newIndex, 0, change.doc.data())
          if(change.newIndex <= newAddClassBoxIndex){
            newAddClassBoxIndex++
          }
        }else if(change.type === "removed"){
          data.splice(change.oldIndex, 1) // splice(start, delCount, ...itemsToReplaceWith)
          if(change.oldIndex <= newAddClassBoxIndex){
            newAddClassBoxIndex = Math.max(0, newAddClassBoxIndex - 1)
          }
        }
			})

			this.setState({
				hasBoxes: true,
				userBoxes: data,
        addClassBoxIndex: newAddClassBoxIndex
			})
		},
		err => {
      console.log(err)
  		this.setState({
				hasBoxes: false,
				userBoxes: [],
        addClassBoxIndex: 0
			})
		})
  }

  // Handles changing display between owner components
  handleChange(ev, index){
    let tabs = this.state.tabs
    tabs[this.state.index] = "hide"
    tabs[index] = "show"
  	this.setState({index: index, tabs: tabs})
  }

  handleChangeIndex(index){
  	this.setState({index: index})
  }

  onAddClassBoxChange(boxIndex){
    this.setState({addClassBoxIndex: boxIndex})
  }

  onAddClassClassChange(name, value){
    let classInfo = this.state.addClassClassInfo
    classInfo[name] = value
    console.log(classInfo)
    this.setState({addClassClassInfo: classInfo})
  }

  addGymClass(){
    if(this.state.userBoxes.length === 0){
			this.props.onAlert({
				type: 'error',
				message: 'No gyms found. Cannot create a class.'
			})
			return
		}

		const { boxID, uid: owner, title: boxTitle } = this.state.userBoxes[this.state.addClassBoxIndex]
		const { title, description, isPrivate } = this.state.addClassClassInfo


		if(!boxID || !title || isPrivate === null || isPrivate === undefined){
			console.log("Error adding class: ")
			console.log(`${boxID}, ${title}, ${isPrivate}`)
      this.props.onAlert({
				type: 'error',
				message: 'Error creating class.'
			})
			return
		}
		console.log(title, description, isPrivate, boxID, boxTitle, owner)
		setGymClass(
			title, this.props.userMD.uid, boxID, boxTitle, isPrivate, owner,
			description
		)
		.then((res)=>{
			this.props.onAlert({
				type: "success",
				message: "Added class!"
			})
		})
		.catch((err)=>{
			this.props.onAlert({
				type: "error",
				message: err.message
			})
		})
  }

  render(){
    return (
    	<Grid item xs={12} id="ownerBox">
    	<AppBar position="static">
        <Tabs value={this.state.index} variant="fullWidth" selectionFollowsFocus
        		onChange={this.handleChange.bind(this)} aria-label="simple tabs example">
          <Tab label="View Gyms"/>
          <Tab label="Add Workout" />
          <Tab label="Add Class" />
          <Tab label="Add Gym" />
        </Tabs>
      </AppBar>
      <Grid item xs={12}>
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
                    addGymClass={this.addGymClass.bind(this)}
                    addClassBoxIndex={this.state.addClassBoxIndex}
                    onBoxChange={this.onAddClassBoxChange.bind(this)}
                    onClassChange={this.onAddClassClassChange.bind(this)}
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

export default withTheme(OwnerControls)


// function TabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <Grid item xs={12}
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Grid item xs={12}>
//           {children}
//         </Grid>
//       )}
//     </Grid>
//   );
// }