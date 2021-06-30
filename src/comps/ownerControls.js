import firebase from "../context/firebaseContext"
import "firebase/firestore"

import React, { Component } from 'react'
import { Grid, Tabs, Tab, AppBar } from '@material-ui/core';

import { withTheme } from '@material-ui/core/styles'
import OwnerBoxes from "./boxes/ownerBoxes"
import AddGymClass from "./gymClasses/addGymClass"
import AddWod from "./wods/addWod"
import AddBox from "./boxes/addBox"
import { setGymClass, getGymClasses } from "../utils/firestore/gymClass"
import { setWod } from "../utils/firestore/wods"
import { CollectionsOutlined } from "@material-ui/icons";


let fs = firebase.firestore()

const SCORETYPES = ["reps", "rounds", "time", "total"]

class OwnerControls extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      userBoxes: [],
      gymClasses: [],
      index: 0,
      initBoxLoad: true,
      addClassBoxIndex: 0,
      addClassClassInfo: {title: "", description: "", isPrivate: false},
      addWodWodInfo: {title: "", wodText: ""},
      addWodBoxSelected: 0,
      addWodGymClassSelected: 0,
      addWodScoreTypeSelected: 0,
      addWodTitleForm: "",
      addWodWodTextForm: "",
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
	  return state
  }

  componentDidUpdate(){
    if(this.state.userMD.accountType === "owner"){
      if(!this.boxListener){
        this.listenForBoxes()
      }
    }
  }

  componentWillUnmount(){
    if(this.boxListener){
      this.boxListener()
    }
    if(this.gymClassListener){
      this.gymClassListener()
    }
  }

  listenForBoxes(){
  	if(!this.state.user || this.boxListener)
  		return

		this.boxListener = fs.collection("boxes").where("uid", "==", this.state.user.uid)
		.onSnapshot(ss => {
			let data = this.state.userBoxes
      let newAddClassBoxIndex = this.state.addClassBoxIndex
      let newAddWodBoxIndex = this.state.addWodBoxSelected

      ss.docChanges().forEach(change => {
        if(change.type === "added"){
          data.splice(change.newIndex, 0, change.doc.data())
          if(this.state.userBoxes.length > 0){
            if(change.newIndex <= newAddClassBoxIndex){
              newAddClassBoxIndex++
            }
            if(change.newIndex <= newAddWodBoxIndex){
              newAddWodBoxIndex++
            }
          }
        }else if(change.type === "removed"){
          data.splice(change.oldIndex, 1) // splice(start, delCount, ...itemsToReplaceWith)
          if(this.state.userBoxes.length > 0){
            if(change.oldIndex <= newAddClassBoxIndex){
              newAddClassBoxIndex = Math.max(0, newAddClassBoxIndex - 1)
            }
            if(change.oldIndex <= newAddWodBoxIndex){
              newAddWodBoxIndex = Math.max(0, newAddWodBoxIndex - 1)
            }
          }
        }
			})

      // If there is no listener set, set it
      if(!this.gymClassListener && data.length > 0){
        this.setGymClassListner(data[0].boxID)
      }

      if(this.state.initBoxLoad){
        this.setState({
          userBoxes: data,
          initBoxLoad: false
        })
      }
      else if(data.length === 0){
        this.setState({
          userBoxes: [],
          addClassBoxIndex: 0,
          addWodBoxSelected: 0,
          addWodGymClassSelected: 0
        })
      }
      else{
        this.setState({
          userBoxes: data,
          addClassBoxIndex: newAddClassBoxIndex,
          addWodBoxSelected: newAddWodBoxIndex,
          addWodGymClassSelected: 0
        })
      }

		},
		err => {
      console.log(err)
  		this.setState({
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

  /**addWod.js
   *
   *
   */
  addWodOnChange(name, value){
    // When box changes, set new class listener.
    if(name === "addWodBoxSelected"){
      this.setGymClassListner(this.state.userBoxes[value].boxID)
    }
    let state = {}
    state[name] = value
    this.setState(state)
  }

  setGymClassListner(boxID){
    console.log(boxID)
    // When box changes, set new class listener.
    if(this.gymClassListener){
      // Reset listener
      this.gymClassListener()
    }
    this.gymClassListener = getGymClasses(boxID)
    .onSnapshot(ss => {
      if(!ss.empty){
        let classes = []
        ss.forEach(doc => {
          classes.push(doc.data())
        })
        this.setState({
          gymClasses: classes,
          addWodGymClassSelected: 0
        })
      }else{
        this.setState({
          gymClasses: [],
          addWodGymClassSelected: 0
        })
      }
    },
    err => {console.log(err)})
  }

  missingInfoError(){
    this.props.onAlert({
      type: "error",
      message: "Missing information."
    })
  }

  createWOD(){
    let box = this.state.userBoxes[this.state.addWodBoxSelected]
    let gymClass = this.state.gymClasses[this.state.addWodGymClassSelected]
		if(!box || !gymClass){
     this.missingInfoError()
      return
    }
    const { boxID, uid: owner, title: boxTitle } = box
    const { gymClassID, isPrivate, title: classTitle } = gymClass

    let title = this.state.addWodTitleForm
    let scoreType = SCORETYPES[this.state.addWodScoreTypeSelected]
    let wodText = this.state.addWodWodTextForm

    if(!boxID || !gymClassID || !title || !scoreType || !wodText || !owner || !classTitle || isPrivate === undefined){
      console.log("Error with input createWod")
      console.log(boxID, gymClassID, title, scoreType, wodText, owner, classTitle, isPrivate)
      this.missingInfoError()
      return
    }

    setWod(title, boxID, gymClassID, owner, boxTitle,
      classTitle, scoreType, wodText, isPrivate)
    .then((res)=>{
      this.props.onAlert({
        type: "success",
        message: "Added workout!"
      })
    })
    .catch((err)=>{
      this.props.onAlert({
        type: "error",
        message: err.message
      })
    })
  }

  /** addClass.js
   *
   *
   */
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
        <Grid item xs={12} className={`${this.state.tabs[0]} slide-left`}>
          <OwnerBoxes
            user = {this.state.user}
            userMD = {this.state.userMD}
            userBoxes = {this.state.userBoxes}
            handleChange={(ev) => this.handleChange(ev, 3)}
            onAlert={this.props.onAlert}
          />
        </Grid>
        <Grid item xs={12} className={`slide-left ${this.state.tabs[1]}`}>
            <AddWod
              isOwnerView={true}
              userMD={this.state.userMD}
              userBoxes = {this.state.userBoxes}
              gymClasses = {this.state.gymClasses}
              addWodScoreTypes={SCORETYPES}
              addWodBoxSelected = {this.state.addWodBoxSelected}
              addWodGymClassSelected = {this.state.addWodGymClassSelected}
              addWodScoreTypeSelected = {this.state.addWodScoreTypeSelected}
              addWodTitleForm = {this.state.addWodTitleForm}
              addWodWodTextForm = {this.state.addWodWodTextForm}
              addWodOnChange={this.addWodOnChange.bind(this)}
              createWOD={this.createWOD.bind(this)}
              onAlert={this.props.onAlert}

            />
        </Grid>
        <Grid item xs={12} className={`slide-right ${this.state.tabs[2]}`}>
            <AddGymClass
              userMD = {this.state.userMD}
              userBoxes = {this.state.userBoxes}
              onAlert={this.props.onAlert}
              addGymClass={this.addGymClass.bind(this)}
              addClassBoxIndex={this.state.addClassBoxIndex}
              onBoxChange={this.onAddClassBoxChange.bind(this)}
              onClassChange={this.onAddClassClassChange.bind(this)}
            />
        </Grid>
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