import firebase from "../context/firebaseContext"
import "firebase/auth"

import { Link } from 'react-router-dom';


import React, { Component, createRef } from "react";

import {
	 AppBar, Toolbar, IconButton, Button, Typography, Paper, Collapse,
	 Popper, MenuList, MenuItem, ClickAwayListener, Grow, Fade

} 
from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { Alert } from '@material-ui/lab'
import { withTheme, withStyles, makeStyles } from '@material-ui/core/styles';

const StyledMenuItem = withStyles((theme) => ({
	root: {
	  '&:hover': {
		backgroundColor: theme.palette.primary.main,
		'& .MuiListItemIcon-root, & .MuiListItemText-primary': {
		  color: theme.palette.common.white,
		},
	  },
	},
  }))(MenuItem);

const StyledTypography = withStyles((theme) => ({
	root: {
		color: theme.palette.text.primary	
	},
}))(Typography);

const StyledPaper = withStyles((theme) => ({
	root: {
		'border': '1px solid',
	  'borderColor': theme.palette.text.primary,
	},
}))(Paper);


const styles = theme => ({
  popper: {
	  zIndex: 100,
  }
});


function UserAlertRaw(props){
	return(
		<Alert severity={props.alertInfo.type} onClose={props.onCloseAlert}>
			{props.alertInfo.message}
		</Alert>
	)
}

const UserAlert = withTheme(UserAlertRaw)

class Header extends Component{
	constructor(props){
		super(props)
		this.menuRef = createRef()
		this.state = {
			user: props.user,
			userMD: props.userMD,
			open: false,
			alertOpen: props.alertOpen,
			alertInfo: props.alertInfo
		}
	}

	static getDerivedStateFromProps(props, state){
		return props
  	}
	  
	handleToggle(){
		this.setState({open: !this.state.open})
	};
	
	handleClose(ev){
		console.log("Should close")
		this.setState({open: false})
	}

	handleListKeyDown(ev) {
		if (ev.key === 'Tab') {
			ev.preventDefault();
			this.setState({open: false})
		}
	}

	render(){
		const { classes } = this.props
		return(
			<AppBar position="sticky" ref={this.menuRef} 
					style={{background:this.props.theme.palette.background.toolbar}}>
			<Toolbar disableGutters={false}>
			    <StyledTypography  variant="h3" >
		            WodTrackrr
		          </StyledTypography>
				  
		          <section style={{marginLeft: "auto", marginRight: -12}}>
					<IconButton color="primary" onClick={this.handleToggle.bind(this)}>
						<Menu   />
					</IconButton>
					<Popper open={this.state.open} anchorEl={this.menuRef.current}
							  placement="bottom-end" transition disablePortal
							 className={classes.popper}>
						{({ TransitionProps, placement }) => (
							<Fade
							{...TransitionProps}
							style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
							>
							<StyledPaper>
								<ClickAwayListener onClickAway={this.handleClose.bind(this)}>
								<MenuList  id="menu-list-grow" onKeyDown={this.handleListKeyDown.bind(this)}>
									<StyledMenuItem onClick={this.props.changeTheme}>
										Change Theme
									</StyledMenuItem>

									<StyledMenuItem onClick={this.handleClose.bind(this)} component={Link} to="/settings/">
										Settings 
									</StyledMenuItem>
									
									{this.state.user?
										
										<StyledMenuItem onClick={(ev) => {
											this.handleClose.bind(this)(ev)
											this.props.handleLogout()
										}}>
											Logout
										</StyledMenuItem>
									:
										<StyledMenuItem component={Link} to="/login"
											onClick={ this.handleClose.bind(this) }>
												Login
										</StyledMenuItem>
				
									
									}
								</MenuList>
								</ClickAwayListener>
							</StyledPaper>
							</Fade>
						)}
					</Popper>
		          	</section>
		        </Toolbar>
				<Collapse in={this.props.alertOpen}>
					{this.state.alertInfo ?
						<UserAlert  alertInfo={this.state.alertInfo} 
							onCloseAlert={this.props.onCloseAlert}
						/>
					:
						<React.Fragment></React.Fragment>
					}

				</Collapse>
			</AppBar>
		)
	}
}



export default withStyles(styles, { withTheme: true })(Header);
