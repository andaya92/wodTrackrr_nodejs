import React, { Component } from 'react'

// Material UI
import
{ 	Grid, Paper, Button, Typography, Modal
} from '@material-ui/core';

import { withTheme } from '@material-ui/core/styles';

import "../../styles.css"

const API_KEY = process.env.REACT_APP_API_KEY

let autoComplete;

const loadScript = (url, callback) => {
  let script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = function() {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
				console.log("Calling callback1")
        callback();
      }
    }
  } else {
    script.onload = () => callback();
		console.log("Calling callback2")
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

function handleScriptLoad(updateQuery, autoCompleteRef) {
	console.log("Handling script load")
	console.log(autoCompleteRef.current)
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,
		{
			types: ["address"],
			fields: ["address_components", "adr_address", "formatted_address", "opening_hours"],
			componentRestrictions: {
				 country: "us"
			}
		}
  );

	autoCompleteRef.current.focus();
	autoComplete.addListener("place_changed", () =>
    handlePlaceSelect(updateQuery)
  );
}

async function handlePlaceSelect(updateQuery) {
	console.log("PlacezSelect")
  const addressObject = autoComplete.getPlace()
  const query = addressObject.formatted_address
  updateQuery(query, addressObject)
  console.log(addressObject)
}


class UploadBoxLocationModal extends Component{

	constructor(props){
		super(props)
		this.state = {
			open: props.open,
			location: null,
			formattedAddress: null,
			query: ""
		}
		this.autoCompleteRef = React.createRef() // Create a refernce and pass to GMapsAPI
		/*
		open
		actionText
		cancelText
		modalText
		onAction
		onClose
		*/
	}

	componentDidUpdate(){
		if(this.autoCompleteRef.current && !autoComplete){
			loadScript(
				`https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&v=weekly`,
				() => handleScriptLoad(
					(query, addressObj) => {
						console.log(addressObj)
						this.setState({
							query: query,
							location: addressObj.address_components,
							formattedAddress: addressObj.formatted_address
						})
					},
					this.autoCompleteRef
				)
			)
		}
	}

	static getDerivedStateFromProps(props, state){
		return props
	}

	onChange(ev){
		this.setState({
			query: ev.target.value
		})
	}

	uploadLocation(){
		// calls BoxView::uploadLocation(location)
		if(!this.state.formattedAddress){
			alert("Address not selected.")
			return
		}
		this.props.onAction(this.state.formattedAddress)
	}

	render(){
		console.log(this.state.location)
		return (
			<Modal
			    open={this.state.open}
			    onClose={this.props.onClose}
			    aria-labelledby="simple-modal-title"
			    aria-describedby="simple-modal-description">
				<div style={{
					position: 'absolute',
					top: "50%",
					left: "50%",
					width: "80vw",
				    transform: "translate(-50%, -50%)",
				}}>

					<Grid
						item
						align="center"
						xs={12}
					>
					<Paper style={{height:"25vh", display: "flex", flexDirection: "column", justifyContent: "center"}}>
						<Grid item container xs={12}>
							{/* <Grid item xs={12} container alignContent="center" justify="center" alignItems="center" direction="column" > */}
								<Grid item xs={12} style={{marginTop: "20px"}}>
									<img src={this.state.previewURL} alt="preview" style={{width: "25vw"}} />
								</Grid>
							{/* </Grid> */}

							<Grid item xs={12}>
								<Typography style={{marginTop: "32px"}}>
									{this.props.modalText}

								</Typography>
								<div className="search-location-input">
									<input
										ref={this.autoCompleteRef}
										id="autoCompleteRef"
										onChange={this.onChange.bind(this)}
										placeholder="Enter a City"
										required

										value={this.state.query}
									/>
								</div>
							</Grid>

							<Grid item xs={6}>
								<Button
									variant="outlined"
									onClick={()=>{ this.props.onClose()}}>
									{this.props.cancelText}
								</Button>
							</Grid>
							<Grid item xs={6}>
								<Button
									color="primary"
									variant="outlined"
									onClick={()=>{ this.uploadLocation()}}>
									{this.props.actionText}
								</Button>
							</Grid>
						</Grid>
					</Paper>
					</Grid>
				</div>
			</Modal>

		)
	}

}

export default UploadBoxLocationModal = withTheme(UploadBoxLocationModal)