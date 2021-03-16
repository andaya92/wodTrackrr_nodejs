import React, { Component } from 'react'
import { withTheme } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";

import
{ 	Grid, Paper, Box, Button, Typography, IconButton
} from '@material-ui/core';

import { ArrowBackIos } from '@material-ui/icons';

class BackButton extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <Box  style={{}}>
                <IconButton onClick={this.props.history.goBack }
                    style={{color: this.props.theme.palette.text.primary}}>
                    <ArrowBackIos />
                </IconButton>
            </Box>
        )
    }
}


export default BackButton = withRouter(withTheme(BackButton))