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

class InviteView extends Component {
	constructor(props){
		super(props)
		this.state = {
            filteredUsers: props.filteredUsers,
		}
	}

	componentDidMount(){
       
	}

	static getDerivedStateFromProps(props, state){
        
		return props
	}

    componentWillUnmount(){
    }

	
  render(){
		return( 
			<Modal
                open={this.props.modalOpen}
                onClose={this.props.onModalClose}
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
                                <Typography variant="h6">
                                    {this.props.title}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{marginTop: "16px"}}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    onChange={this.props.onChange.bind(this)}
                                    placeholder="Search Users"
                                    style={{margin: "0px 0px 8px 0px"}}
                                    InputProps={{
                                        endAdornment: (
                                        <InputAdornment position="end">
                                            <SearchIcon color="primary" />
                                        </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} style={{marginTop: "16px"}}>
                                <Select native style={{
                                        width: "100%",
                                        margin: "0px 0px 8px 0px",
                                        padding: "4px"
                                    }}
                                    color="primary"
                                    onChange={this.props.onSelectChange.bind(this)}>
                                    {this.state.filteredUsers ?
                                        this.state.filteredUsers.map((user, i) => {
                                            return (<option key={i} 
                                                            value={JSON.stringify(user)} >
                                                            {user["username"]}
                                                    </option>)
                                        })
                                    :
                                        <option aria-label="None" value="" >No users!</option>
                                    }
                                </Select>
                            </Grid>
                            
                                <Grid item xs={6} style={{margin: "16px 0px 16px 0px"}}>
                                    <Button fullWidth
                                        style={{
                                            borderColor: this.props.theme.palette.text.primary                                        }}
                                        size="small"
                                        onClick={this.props.onModalClose}>
                                        Cancel
                                    </Button>
                                </Grid>
                                <Grid item xs={6} style={{marginTop: "16px"}}>
                                    <Button fullWidth
                                        color="primary"
                                        size="small"
                                        onClick={this.props.sendInvite.bind(this)}>
                                        Invite
                                    </Button>
                                </Grid>
                            
                        </Grid>
                    </Paper>
                </div>
            </Modal>
    )}
}

export default InviteView = withTheme(InviteView)