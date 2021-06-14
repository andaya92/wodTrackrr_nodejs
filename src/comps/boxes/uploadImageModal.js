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

import { withTheme, withStyles } from '@material-ui/core/styles';


import SearchIcon from '@material-ui/icons/Search';
import { Alert } from '@material-ui/lab';


const DEFAULT_PREVIEW_URL = "https://www.kindpng.com/picc/m/117-1172923_clip-art-clip-art-panda-free-clipart-transparent.png"


class UploadImageModal extends Component{

	constructor(props){
		super(props)
		this.state = {
			open: props.open,
			file: null,
			previewURL: DEFAULT_PREVIEW_URL
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

	onChange(ev){
		console.log(ev)
		let { files } = ev.target
		const file = files[0]

		if(files && files.length > 0){
			let reader = new FileReader()

			reader.addEventListener('load', () => {
				this.setState({
					file: file,
					previewURL: reader.result
				})
			})

			reader.readAsDataURL(file)
		}
	}

	uploadImage(){
		// calls BoxSearch:: uploadImage(file)
		this.props.onAction(this.state.file)
	}

	render(){
		/*
					lookup image
					if exists:
						use
					else:
						lookup default image.
		*/
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
					<Paper style={{height:"50vh", display: "flex", flexDirection: "column", justifyContent: "center"}}>
						<Grid item container xs={12}>


							{/* <Grid item xs={12} container alignContent="center" justify="center" alignItems="center" direction="column" > */}
								<Grid item xs={12} style={{marginTop: "20px"}}>
									<img src={this.state.previewURL} style={{width: "25vw"}} />
								</Grid>
							{/* </Grid> */}

							<Grid item xs={12}>
								<Typography style={{marginTop: "32px"}}>
									{this.props.modalText}
								</Typography>
								<input type="file" onChange={this.onChange.bind(this)}/>
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
									onClick={()=>{ this.uploadImage()}}>
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

export default UploadImageModal = withTheme(UploadImageModal);