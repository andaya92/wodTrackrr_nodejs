// Firebase
import firebase from "../../context/firebaseContext"
import "firebase/firestore"

// React
import React, { Component } from 'react'

// Material UI
import
{ 	Grid
} from '@material-ui/core';

import { withTheme } from '@material-ui/core/styles';

// WodTrackrr

import BoxInfo from "./boxInfo"
import GymClassList from "../gymClasses/gymClassList"
import BackButton  from "../backButton"


import "../../styles.css"



/*
	Given:
		userMD: props.userMD,
		boxID: props.boxID,
	Show:
		details of Box and its WODS, allows for removal of wods by owner
*/
const fs = firebase.firestore();

class BoxView extends Component {
	constructor(props){
		super(props)
		console.log(props)
		this.state = {
			userMD: props.userMD,
			boxID: props.boxID,
			boxMD: {}
		}
	}

	getBoxListener(){
		if(!this.boxListener){
			this.boxListener = fs.collection("boxes").doc(this.state.boxID)
			.onSnapshot(ss => {

				if(ss.exists){

					this.setState({boxMD: ss.data()})
				}else{
					this.setState({boxMD: {}})
				}
			}, err => {
				console.log(err)
			})
		}
	}

	checkListeners(){
		if(this.boxListener === undefined)
			this.getBoxListener()
	}

	componentDidMount(){
		this.checkListeners()
	}

	static getDerivedStateFromProps(props, state){
		return props
	}

	componentDidUpdate(){
		this.checkListeners()
	}

	componentWillUnmount(){
		if(this.boxListener)
			this.boxListener()
	}

	render(){
		let uid = this.state.userMD.uid
		let boxOwnerUid = this.state.boxMD["uid"]
		let showOwnerBtns = uid === boxOwnerUid

		return(
			<Grid item xs={12}>
				<BackButton />
				{Object.keys(this.state.boxMD).length > 0 ?
					<React.Fragment>
						<BoxInfo
							boxID={this.state.boxID}
							boxMD={this.state.boxMD}
						/>
						<GymClassList
							user={this.state.user}
							userMD={this.state.userMD}
							boxID={this.state.boxID}
							isOwner={showOwnerBtns}
							onAlert={this.props.onAlert}
						/>
					</React.Fragment>
				:
					<React.Fragment></React.Fragment>
				}

			</Grid>
		)
	}
}

export default BoxView = withTheme(BoxView);

