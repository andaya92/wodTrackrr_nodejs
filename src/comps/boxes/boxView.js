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
import { getImage } from "../../utils/firestore/gymImages"
import { setClassImage } from "../../utils/firestore/classImages"
import UploadImageModal from "../boxes/uploadImageModal"

import "../../styles.css"



/*
	Given:
		userMD: props.userMD,
		boxID: props.boxID,
	Show:
		details of Box and its WODS, allows for removal of wods by owner
*/
const fs = firebase.firestore();
const DEFAULT_IMAGE_URL = "https://cdn.shopify.com/s/files/1/2416/1345/files/NCFIT_Logo_Shop_3x_5224365a-50f5-4079-b7cc-0f7ebeb4f470.png?height=628&pad_color=ffffff&v=1595625119&width=1200"


class BoxView extends Component {
	constructor(props){
		super(props)
		console.log(props)
		this.state = {
			userMD: props.userMD,
			boxID: props.boxID,
			boxMD: {},
			boxImageURL: DEFAULT_IMAGE_URL,
			showingUploadImage: false
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
		this.getBoxImage()
	}

	getBoxImage(){
		getImage(this.state.boxID)
		.then(url => {
			this.setState({boxImageURL: url})
		})
		.catch( err => {
			console.log(err)
		})
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


	uploadImage(file){
		if(!this.state.curUploadBoxID || !this.state.curUploadClassID){
			console.log(`No class selected for upload
				${this.state.curUploadBoxID}/${this.state.curUploadClassID}`)
			return
		}

		setClassImage(file, this.state.curUploadBoxID, this.state.curUploadClassID)
		.then(res => {
			console.log(res)
			this.hideUploadImage()
		})
		.catch(err => {
			console.log(err)
		})
	}


	showUploadClassImage(boxID, classID){
		this.setState({
			showingUploadImage: true,
			curUploadBoxID: boxID,
			curUploadClassID: classID,
		})
	}


	hideUploadImage(){
		this.setState({showingUploadImage: false})
	}

	render(){
		let uid = this.state.userMD.uid
		let boxOwnerUid = this.state.boxMD["uid"]
		let showOwnerBtns = uid === boxOwnerUid

		return(
			<Grid item container xs={12}>
				<Grid item xs={1}>
					<BackButton />
				</Grid>
				<Grid item xs={10}>
				{Object.keys(this.state.boxMD).length > 0 ?
					<React.Fragment>
						<BoxInfo
							userMD={this.state.userMD}
							boxID={this.state.boxID}
							boxMD={this.state.boxMD}
							url={this.state.boxImageURL}
							onAlert={this.props.onAlert}
						/>
						<GymClassList
							user={this.state.user}
							userMD={this.state.userMD}
							boxID={this.state.boxID}
							isOwner={showOwnerBtns}
							showUploadClassImage={this.showUploadClassImage.bind(this)}
							onAlert={this.props.onAlert}
						/>
					</React.Fragment>
				:
					<React.Fragment></React.Fragment>
				}
				<UploadImageModal
          open={this.state.showingUploadImage}
          actionText="Upload Image"
          cancelText="Cancel"
          modalText="Select an image to upload"
          onAction={this.uploadImage.bind(this)}
          onClose={this.hideUploadImage.bind(this)}
        />
				</Grid>
			</Grid>
		)
	}
}

export default BoxView = withTheme(BoxView);

