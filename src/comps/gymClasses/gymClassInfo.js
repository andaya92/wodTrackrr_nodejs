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
	TableHead, TablePagination, TableRow, TableSortLabel
} from '@material-ui/core';

import { withTheme } from '@material-ui/core/styles';

const fs = firebase.firestore();


class GymClassInfo extends Component {
	constructor(props){
		super(props)
		this.state = {
		}
	}

	static getDerivedStateFromProps(props, state){

		return props
	}

    render(){
		return(
		<Grid item xs={12}>
            Gym class info
        </Grid>
    )}
}

export default GymClassInfo = withTheme(GymClassInfo)