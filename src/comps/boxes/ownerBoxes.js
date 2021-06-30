import React, { Component } from 'react'

import{
	Grid, Paper, Typography, Button, Card, CardActionArea,
 CardContent, CardActions, CardMedia
}from '@material-ui/core';

import { withTheme, withStyles } from '@material-ui/core/styles'


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
      currentBoxID: "",
      showRemoveAlert: false,
      curRemoveBoxID: "",
      curRemoveBoxTitle: ""
    }
  }

  static getDerivedStateFromProps(props, state){
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
					<EmptyBox
						handleChange={this.props.handleChange}
					/>
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

const StyledCardMedia = withStyles(theme =>({
  root:{
    width: "50%",
    margin: "0 auto",
    borderRadius: "8px"
  }
}))(CardMedia)



function EmptyBoxRaw(props){
  return(
    <Card >
    <CardActionArea>
      <StyledCardMedia component="img"
        image="empty.png"
        title="No gyms"
      />
      <CardContent>
        <Grid item align='left' xs={12}>
				<Typography noWrap align="center">No gyms Found!!</Typography>

        </Grid>
      </CardContent>
    </CardActionArea>
			<CardActions align="center">
				<Button
					variant="outlined"
					color="primary"
					onClick={props.handleChange}
					style={{ margin: '0 auto'}}
				>
					Create Gym
				</Button>
			</CardActions>

  </Card>
  )
}
const EmptyBox = withTheme(EmptyBoxRaw)
