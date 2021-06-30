// Firebase
import firebase from "../../context/firebaseContext"
import "firebase/firestore"

// React
import React, { Component } from 'react'

// Material UI
import{
	Grid, Typography
} from '@material-ui/core'

import { withTheme } from '@material-ui/core/styles'

// WodTrackrr
import BoxInfo from "./boxInfo"
import GymClassList from "../gymClasses/gymClassList"
import BackButton  from "../backButton"
import UploadImageModal from "../boxes/uploadImageModal"
import UploadBoxLocationModal from "../boxes/uploadBoxLocationModal"
import { getImage } from "../../utils/firestore/gymImages"
import { setClassImage } from "../../utils/firestore/classImages"
import { updateBoxLocation } from "../../utils/firestore/boxLocation"

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
			showingUploadImage: false,
			showingUploadBoxLocation: false
		}
	}

	static getDerivedStateFromProps(props, state){
		return props
	}

	componentDidMount(){
		this.checkListeners()
		this.getBoxImage()
	}

	componentDidUpdate(){
		this.checkListeners()
	}

	componentWillUnmount(){
		if(this.boxListener)
			this.boxListener()
	}

	checkListeners(){
		if(!this.boxListener)
			this.getBoxListener()
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

	getBoxImage(){
		getImage(this.state.boxID)
		.then(url => {
			this.setState({boxImageURL: url})
		})
		.catch( err => {
			console.log(err)
		})
	}

	uploadImage(file){
		if(!this.state.boxID || !this.state.curUploadClassID){
			console.log(`No class selected for upload
				${this.state.boxID}/${this.state.curUploadClassID}`)
			return
		}

		setClassImage(file, this.state.boxID, this.state.curUploadClassID)
		.then(res => {
			console.log(res)
			this.setState({
				showingUploadImage: false,
				curUploadClassID: ""
			})
		})
		.catch(err => {
			console.log(err)
			this.hideUploadImage()
		})
	}

	uploadBoxLocation(location){
		if(!this.state.boxID || !location || !this.state.userMD){
			console.log(`No box location selected for (${this.state.boxID}): ${location}`)
			return
		}

		console.log(`Uploading box location: ${location}`)
		updateBoxLocation(this.state.boxID, location, this.state.userMD.uid)
		.then(res => {
			console.log(res)
			this.hideUploadBoxLocation()
			this.props.onAlert({
				type: 'success',
				message: "Updated location."
			})
		})
		.catch(err => {
			console.log(err)
		})
	}

	showUploadClassImage(classID){
		this.setState({
			showingUploadImage: true,
			showingUploadBoxLocation: false,
			curUploadClassID: classID,
		})
	}

	hideUploadImage(){
		this.setState({showingUploadImage: false})
	}

	showUploadBoxLocation(){
		this.setState({
			showingUploadBoxLocation: true,
			showingUploadImage: false
		})
	}

	hideUploadBoxLocation(){
		this.setState({showingUploadBoxLocation: false})
	}

	render(){
		const { uid } = this.state.userMD
		const { uid: boxOwnerUID } = this.state.boxMD
		let showOwnerBtns = boxOwnerUID && uid === boxOwnerUID

		return(
			<Grid item container xs={12}>
				<Grid item xs={1}>
					<BackButton />
				</Grid>
				<Grid item xs={10} style={{marginTop: "48px"}}>
				{Object.keys(this.state.boxMD).length > 0 ?
					<React.Fragment>
						<BoxInfo
							userMD={this.state.userMD}
							boxID={this.state.boxID}
							boxMD={this.state.boxMD}
							url={this.state.boxImageURL}
							onAlert={this.props.onAlert}
							onLocation={this.showUploadBoxLocation.bind(this)}
						/>

						<Grid item xs={12} style={{marginTop: "32px"}}>
							<Typography
								gutterBottom variant="h4" color="secondary"
							>
								Classes
							</Typography>
						</Grid>
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

				<UploadBoxLocationModal
          open={this.state.showingUploadBoxLocation}
          actionText="Upload Location"
          cancelText="Cancel"
          modalText="Type your address or find it on the map."
          onAction={this.uploadBoxLocation.bind(this)}
          onClose={this.hideUploadBoxLocation.bind(this)}
        />
				</Grid>
			</Grid>
		)
	}
}

export default BoxView = withTheme(BoxView);

