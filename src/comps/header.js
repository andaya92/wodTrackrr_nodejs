import React, { Component } from "react";

import { AppBar, Toolbar, IconButton, Button, Typography} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { withTheme } from '@material-ui/core/styles';


class Header extends Component{
	constructor(props){
		super(props)
	}

	render(){
		return(
			<AppBar position="static" 
					style={{background:this.props.theme.palette.background.toolbar}}>
			<Toolbar disableGutters={false}>
			    <Typography gutterBottom variant="h3" style={{"margin": "0 auto"}}>
		            WodTrackrr
		          </Typography>
		        </Toolbar>
			</AppBar>
		)
	}
}


export default Header = withTheme(Header);