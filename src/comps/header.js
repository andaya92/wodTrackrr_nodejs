import firebase from "../context/firebaseContext"
import "firebase/auth"

import { Link } from 'react-router-dom';


import React, { Component } from "react";

import { AppBar, Toolbar, IconButton, Button, Typography} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { withTheme } from '@material-ui/core/styles';

class Header extends Component{
	constructor(props){
		super(props)
		this.state = {
			user: props.user,
			userMD: props.userMD
		}
	}

	static getDerivedStateFromProps(props, state){
		return props
  	}

	render(){
		return(
			<AppBar position="static" 
					style={{background:this.props.theme.palette.background.toolbar}}>
			<Toolbar disableGutters={false}>
			    <Typography gutterBottom  variant="h3">
		            WodTrackrr
		          </Typography>
				  
		          <section style={{marginLeft: "auto", marginRight: -12}}>
		          	<Button size="small" onClick={this.props.changeTheme}>Change Theme</Button>
					{this.state.user?
			          	<Button variant="outlined" color="secondary"
	                      onClick={this.props.handleLogout}>
			                <Typography variant="subtitle2">
			                  Logout
			                </Typography>
			            </Button>
			           :
			           <Button to="/login"
			           		component={Link} variant="outlined" color="secondary">
			                <Typography variant="subtitle2">
			                  Login
			                </Typography>
			            </Button>
		          	}
		          	</section>
		        </Toolbar>
			</AppBar>
		)
	}
}


export default Header = withTheme(Header);