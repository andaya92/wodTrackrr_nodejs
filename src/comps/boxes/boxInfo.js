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
	CircularProgress, LinearProgress, CardActions, Card, CardContent,
	Modal, InputAdornment, TableBody, Table, TableCell, TableContainer,
	TableHead, TablePagination, TableRow, TableSortLabel, IconButton
} from '@material-ui/core';


import { ArrowBackIos } from '@material-ui/icons';

import { withTheme } from '@material-ui/core/styles';

import EditBoxInfo from "./editBoxInfo"

const fs = firebase.firestore();


class BoxInfo extends Component {
	constructor(props){
		super(props)
		this.state = {
			boxID: props.boxID,
			boxMD: props.boxMD,
			editModalOpen: false
		}
		console.log(props.boxMD)
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
		let dateJoined = new Date(this.state.boxMD.date).toString()
		return(
		<Grid item xs={12}>
            Gym info
			{this.state.boxID}
			<Grid item xs={12}>
				<Paper>
					<Typography variant="h3">
						{this.state.boxMD.title}
					</Typography>
					<Typography variant="caption">{dateJoined}</Typography>
					<IconButton onClick={this.openEditInfo.bind(this)}>
						<ArrowBackIos />
					</IconButton>
				</Paper>
			</Grid>
			<EditBoxInfo
				open={this.state.editModalOpen}
				onClose={this.closeEditInfo.bind(this)}
				boxMD={this.state.boxMD}
			/>
        </Grid>
    )}
}

export default BoxInfo = withTheme(BoxInfo)