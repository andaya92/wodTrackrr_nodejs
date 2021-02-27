import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom';

// Material UI
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import 
{ 	Grid, Paper, Button, Typography, Collapse, TextField, Select,
	Accordion, AccordionSummary, AccordionDetails, FormControlLabel,
	CircularProgress, LinearProgress, CardActions, Card, CardContent,
	Modal, InputAdornment, TableBody, Table, TableCell, TableContainer,
	TableHead, TablePagination, TableRow, TableSortLabel
} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';
import { Alert } from '@material-ui/lab';


export default class ActionCancelModal extends Component{

	constructor(props){
		super(props)
		this.state = {
			open: props.open
		}
		/*
		open
		actionText
		cancelText
		modalText
		onAction
		onClose
		*/
	}

	static getDerivedStateFromProps(props, state){
		return props
	}

	render(){
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
		    			<Typography style={{position: ""}}>
		    				 {this.props.modalText}
		    			</Typography>


		    			<Button 
		    				color="primary"
		    				variant="outlined" 
		    				onClick={()=>{ this.props.onAction()}}>
		    				{this.props.actionText}
		    			</Button>
		    			<Button 
		    				variant="outlined" 
		    				onClick={()=>{ this.props.onClose()}}>
		    				{this.props.cancelText}
		    			</Button>
					</Paper>
					</Grid>
				</div>
			</Modal>

		)
	}

}

