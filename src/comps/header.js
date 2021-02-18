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

	componentWillReceiveProps(newProps){
    this.setState({...newProps})
  }

	render(){
		return(
			<AppBar position="static" 
					style={{background:this.props.theme.palette.background.toolbar}}>
			<Toolbar disableGutters={false}>
			    <Typography gutterBottom variant="h3">
		            WodTrackrr
		          </Typography>
		          <section style={{marginLeft: "auto", marginRight: -12}}>
		          	{this.state.user?
			          	<Button variant="outlined" color="secondary"
	                      onClick={this.props.handleLogout}>
			                <Typography variant="h6" component="h6">
			                  Logout
			                </Typography>
			            </Button>
			           :
			           <Link to="/login"
			           		component={Button} variant="outlined" color="secondary">
			                <Typography variant="h6" component="h6">
			                  Login
			                </Typography>
			            </Link>
		          	}
		          	</section>
		        </Toolbar>
			</AppBar>
		)
	}
}


export default Header = withTheme(Header);