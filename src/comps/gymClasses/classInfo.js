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

import EditClassInfo from "./editClassInfo"

import { toDayYear } from "../../utils/formatting"

const fs = firebase.firestore();

function Image(props){
	const { classes, children, className, ...other } = props

	return (<img className={clsx(classes.root, className)} {...other}
	/>)
}

const StyledImage = withStyles(theme =>({
	root: {
		width: "100%",
		maxHeight: "15vh",
		margin: "0 auto",
		borderRadius: "8px"
	}
  }))(Image)


class ClassInfo extends Component {
	constructor(props){
		super(props)
		this.state = {
			userMD: props.userMD,
			gymClassMD: props.gymClassMD,
			editModalOpen: false,
			showEditClassInfoBtn: props.showEditBtn
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


		return(
		<Grid item xs={12}>
			<Grid item xs={12}>
				<Paper>
					<Typography variant="h2">
						{this.state.gymClassMD.boxTitle}
					</Typography>
					<Typography variant="h3">
						{this.state.gymClassMD.title}
					</Typography>
					<Typography variant="h4">
						{this.state.gymClassMD.description}
					</Typography>
					<Typography variant="caption">
						Created: { toDayYear(new Date(this.state.gymClassMD.date)) }
					</Typography>
					{this.state.showEditClassInfoBtn?
						<IconButton onClick={this.openEditInfo.bind(this)}
							style={{color: this.props.theme.palette.text.primary}}>
							<EditOutlined />
						</IconButton>
					:
						<React.Fragment></React.Fragment>
					}
					<Grid item align="center" xs={12}>
						<StyledImage
							src="https://cdn.shopify.com/s/files/1/2416/1345/files/NCFIT_Logo_Shop_3x_5224365a-50f5-4079-b7cc-0f7ebeb4f470.png?height=628&pad_color=ffffff&v=1595625119&width=1200"
						/>
					</Grid>
				</Paper>
			</Grid>
			{
				this.state.showEditClassInfoBtn?
					<EditClassInfo
						open={this.state.editModalOpen}
						onClose={this.closeEditInfo.bind(this)}
						gymClassMD={this.state.gymClassMD}
						onAlert={this.props.onAlert}
					/>
				:
				 <React.Fragment></React.Fragment>
			}
        </Grid>
    )}
}

export default ClassInfo = withTheme(ClassInfo)