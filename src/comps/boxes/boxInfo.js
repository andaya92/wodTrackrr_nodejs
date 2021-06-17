// Firebase
import firebase from "../../context/firebaseContext"
import "firebase/firestore"

// React
import React, { Component } from 'react'

// Material UI
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import
{ 	Grid, Paper, Button, Typography, Collapse, TextField, Select,
	Accordion, AccordionSummary, AccordionDetails, FormControlLabel,
	CardMedia, IconButton, Imag
} from '@material-ui/core';

import clsx from 'clsx'

import { ArrowBackIos, EditOutlined } from '@material-ui/icons';

import { withTheme, withStyles } from '@material-ui/core/styles';

import EditBoxInfo from "./editBoxInfo"

import { toDayYear } from "../../utils/formatting"

const fs = firebase.firestore();

function Image(props){
	const { classes, children, className, ...other } = props

	return (<img className={clsx(classes.root, className)} {...other}
	/>)
}

const StyledImage = withStyles(theme =>({
	root: {
		width: "75%",
		margin: "0 auto",
		borderRadius: "8px"
	}
  }))(Image)


class BoxInfo extends Component {
	constructor(props){
		super(props)
		this.state = {
			userMD: props.userMD,
			boxID: props.boxID,
			boxMD: props.boxMD,
			editModalOpen: false
		}
	}

	static getDerivedStateFromProps(props, state){
		return props
	}


	openEditInfo(){
		this.setState({editModalOpen: true})
	}

	closeEditInfo(){
        this.setState({editModalOpen: false})
  }

  render(){
		let showEditBoxInfoBtn = this.state.userMD != null && this.state.boxMD['uid'] == this.state.userMD['uid']
		console.log(`Show edit btn? ${showEditBoxInfoBtn}`)
		return(
		<Grid item xs={12}>
			<Grid item xs={12}>
				<Typography variant="h2">
					{this.state.boxMD.title}
				</Typography>
				<Typography variant="h3">
					{this.state.boxMD.description}
				</Typography>
				<Typography variant="h4">
					Location Here
				</Typography>
				{showEditBoxInfoBtn?
					<IconButton onClick={this.openEditInfo.bind(this)}
						style={{color: this.props.theme.palette.text.primary}}>
						<EditOutlined />
					</IconButton>
				:
					<React.Fragment></React.Fragment>
				}
				<Typography variant="caption">
					Joined: { toDayYear(new Date(this.state.boxMD.date)) }
				</Typography>
				<Grid item align="center" xs={12}>
					<StyledImage
						src={this.props.url}
					/>
				</Grid>
			</Grid>
			{
				showEditBoxInfoBtn?
					<EditBoxInfo
						open={this.state.editModalOpen}
						onClose={this.closeEditInfo.bind(this)}
						boxMD={this.state.boxMD}
						onAlert={this.props.onAlert}
					/>
				:
				 <React.Fragment></React.Fragment>
			}
        </Grid>
    )}
}

export default BoxInfo = withTheme(BoxInfo)