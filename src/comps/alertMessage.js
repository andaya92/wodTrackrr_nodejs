

import React, { Component } from 'react'

import 
{ 	Grid, Paper, Button, Typography, Backdrop } 
from '@material-ui/core';
import {TableCell as TC} from '@material-ui/core';

import { withTheme, withStyles } from '@material-ui/core/styles'



class AlertMessage extends Component {
	constructor(props){
		super(props)
		this.state = {
            message: props.message,
            open: props.showBackgrop,
		}
	}

	static getDerivedStateFromProps(props, state){
		return props
	}

  
	render(){
		return(
			<Backdrop open={this.state.open} onClick={this.props.handleClose}>
                <Paper>
                    <Typography variant="h6">
                        {this.state.message}
                    </Typography>
                </Paper>
            </Backdrop>
		)
	}
}

export default AlertMessage = withTheme(AlertMessage)