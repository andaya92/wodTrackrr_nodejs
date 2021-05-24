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

import SearchIcon from '@material-ui/icons/Search';
import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import { sendAdminInvite } from "../../utils/firestore/classAdmin"

import "../../styles.css"



const fs = firebase.firestore();

class EditBoxInfo extends Component {
	constructor(props){
		super(props)
		this.state = {
            boxMD: props.boxMD
		}
	}

	static getDerivedStateFromProps(props, state){
		return props
	}

    componentWillUnmount(){
    }


    onChange(ev){
	    let boxMD = this.state.boxMD
		const {name, value} = ev.target
		boxMD[name] = value
		this.setState({
            boxMD: boxMD
	  	})
	}

    onSave(){
        console.log("save state")
        console.log(this.state.boxMD)
    }

    render(){
		return(
			<Modal
                open={this.props.open}
                onClose={this.props.onClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description">
                <div style={{
                    position: 'absolute',
                    top: "50%",
                    left: "50%",
                    width: "90vw",
                    transform: "translate(-50%, -50%)",
                }}>
                    <Paper style={{ padding: "8px", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                        <Grid item container align="center" xs={12}>
                            <Grid item xs={12} style={{marginTop: "16px"}}>
                                <TextField
                                    name="title"
                                    value={this.state.boxMD.title}
                                    fullWidth
                                    variant="outlined"
                                    onChange={this.onChange.bind(this)}
                                    placeholder="Title"
                                    style={{margin: "0px 0px 8px 0px"}}
                                    InputProps={{
                                       /* endAdornment: (
                                        <InputAdornment position="end">
                                            <SearchIcon color="primary" />
                                        </InputAdornment>
                                        )*/
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} style={{marginTop: "16px"}}>
                                <TextField
                                    placeholder="Desc"
                                    value={this.state.boxMD.description}
                                    name="description"
                                    fullWidth
                                    variant="outlined"
                                    onChange={this.onChange.bind(this)}
                                    style={{margin: "0px 0px 8px 0px"}}
                                    InputProps={{
                                        /*endAdornment: (
                                        <InputAdornment position="end">
                                            <SearchIcon color="primary" />
                                        </InputAdornment>
                                        )*/
                                    }}
                                />
                            </Grid>

                            <Grid item xs={6} style={{margin: "16px 0px 16px 0px"}}>
                                <Button fullWidth
                                    style={{
                                        borderColor: this.props.theme.palette.text.primary                                        }}
                                    size="small"
                                    onClick={this.props.onClose}>
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item xs={6} style={{marginTop: "16px"}}>
                                <Button fullWidth
                                    color="primary"
                                    size="small"
                                    onClick={this.onSave.bind(this)}>
                                    Save
                                </Button>
                            </Grid>

                        </Grid>
                    </Paper>
                </div>
            </Modal>
    )}
}

export default EditBoxInfo = withTheme(EditBoxInfo)