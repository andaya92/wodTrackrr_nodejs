// Firebase
import firebase from "../../context/firebaseContext"
import "firebase/firestore"

// React
import React, { Component } from 'react'
import { Redirect } from "react-router";
import { withRouter } from "react-router-dom";

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


import "../../styles.css"



const fs = firebase.firestore();

class DeleteAccount extends Component {
	constructor(props){
		super(props)
		this.state = {
            user: props.user,
            userConfirmText: ""
		}
	}

	componentDidMount(){

	}

	static getDerivedStateFromProps(props, state){
		return state.user? state: props
	}

    componentWillUnmount(){
    }

    confirmText(){
        return this.state.user.uid.slice(-5)
    }

    onChange(ev){
        let value = ev.target.value
        this.setState({userConfirmText: value})
    }

    removeUser(){
        if(this.state.userConfirmText === this.confirmText()){
            console.log("Deleting user, actual code commented out.")
            // this.state.user.delete()
            // .then(() => {
            //     console.log("User deleted.")
            // })
            // .catch(err => {
            //     console.log("Error deleting user.")
            // })
            this.setState({redirect: true, redirectUrl: "/boxSearch"})
            this.props.history("/boxSearch")

        }else{
            console.log("User entered incorrect confirmation.")
        }
    }


  render(){
		return(
            <Paper elevation={6}>
                <Grid item container align="center" xs={12} style={{marginTop: "16px"}}>
                    <Grid item xs={12}>
                        <Typography>Type to Confirm Delete: {this.confirmText()}</Typography>
                    </Grid>
                    <Grid item xs={12} style={{marginTop: "16px"}}>
                        <TextField
                            type="text"
                            placeholder="Type username to confirm delete"
                            onChange={this.onChange.bind(this)}
                        />
                    </Grid>
                    <Grid item xs={12} style={{marginTop: "32px"}}>
                        <Button size="small" fullWidth variant="outlined"
                            onClick={this.removeUser.bind(this)}
                            style={{color: this.props.theme.palette.error.main}}>
                                Confirm Remove
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
    )}
}

export default DeleteAccount = withRouter(withTheme(DeleteAccount))