import React, { Component } from 'react'

import
{ 	Grid, Paper, Button, Typography, Collapse, TextField, Select,
	Accordion, AccordionSummary, AccordionDetails, FormControlLabel,
	CircularProgress, LinearProgress, Modal
}
from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import BoxView from "./boxView"
import BoxSearch from "./boxSearch"
import { removeBox } from "../../utils/firestore/boxes"
import ActionCancelModal from "../actionCancelModal"

import "../../styles.css"

class BoxListAccordion extends Component {
  constructor(props){
    super(props)
    this.state = {
      userMD: props.userMD,
      userBoxes: props.userBoxes,
      hasBoxes: props.hasBoxes,
      currentBoxID: "",
      showRemoveAlert: false,
      curRemoveBoxID: "",
      curRemoveBoxTitle: ""
    }
  }

  static getDerivedStateFromProps(props, state){
	  console.log(props)
    return props
  }

  componentWillUnmount(){
  	console.log("Component will unmount")
  }

  handleRemoveBox(boxID, boxTitle){
  	this.setState({
  		showRemoveAlert: true,
  		curRemoveBoxID: boxID,
  		curRemoveBoxTitle: boxTitle
  	})
  }

  handleModalClose(){
  	this.setState({showRemoveAlert:false})
  }

  deleteBox(){
	this.handleModalClose()
	console.log("removing box: ", this.state.curRemoveBoxID)
  	removeBox(this.state.curRemoveBoxID)
  	.then((res)=>{
  		this.props.onAlert({
			  type: "success",
			  message: "Removed gym!"
		  })
  	})
  	.catch((err)=>{
		this.props.onAlert({
			type: "error",
			message: err
		})
	})
  }

  render(){
	return(
		<Grid item xs ={12}>
			<Grid item xs={12}>
				{
					this.state.userBoxes.length > 0
				?
					<BoxSearch
						userMD = {this.state.userMD}
						allBoxes = {this.state.userBoxes}
						filteredBoxes={this.state.userBoxes}
						handleRemoveBox={this.handleRemoveBox.bind(this)}
						isOwner = {true}
						onAlert={this.props.onAlert}
					/>
				:
					<Grid item zeroMinWidth xs={12}>
						<Paper elevation={4} style={{padding: "1vw"}}>
							<Typography noWrap align="left">No gyms Found!</Typography>
						</Paper>
					</Grid>
				}
			</Grid>
			<ActionCancelModal
				open={this.state.showRemoveAlert}
				onClose={this.handleModalClose.bind(this)}
				onAction={this.deleteBox.bind(this)}
				modalText={ `Remove ${this.state.curRemoveBoxTitle} (${this.state.curRemoveBoxID})`}
				actionText={"Remove"}
				cancelText={"Cancel"}
			/>
		</Grid>
	)
  }
}

export default BoxListAccordion = withTheme(BoxListAccordion);

