import { Link } from 'react-router-dom';
import React, { Component, createRef } from "react";

import {
	 AppBar, Toolbar, IconButton, Typography, Paper,
	 Popper, MenuList, MenuItem, ClickAwayListener, Fade

}
from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { Alert } from '@material-ui/lab'
import { withTheme, withStyles } from '@material-ui/core/styles';

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


const StyledPaper = withStyles((theme) => ({
	root: {
		'border': '1px solid',
	  'borderColor': theme.palette.text.primary,
	},
}))(Paper);


const StyledAlert = withStyles((theme) => ({
	root: {
		position: 'absolute',
		top: '56px'
	},
}))(Alert);


function UserAlertRaw(props){
	return(
		<StyledAlert
			id={props.id}
			style={{
				// left: `calc(50% - ${props.left}px)`,
				width: "calc(100% - 32px)",
				display: props.open? 'flex' : 'none'
			}}
				severity={props.alertInfo.type}
				onClose={props.onCloseAlert}
			>
				{props.alertInfo.message}
		</StyledAlert>
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
			alertInfo: props.alertInfo,
			alertLeftPos: 1
		}
	}

	static getDerivedStateFromProps(props, state){
		return props
  }


	handleToggle(){
		this.setState({open: !this.state.open})
	};

	handleClose(ev){
		this.setState({open: false})
	}

	handleListKeyDown(ev) {
		if (ev.key === 'Tab') {
			ev.preventDefault();
			this.setState({open: false})
		}
	}

	render(){
		return(
			<AppBar position="sticky" ref={this.menuRef}
				style={{background:this.props.theme.palette.background.toolbar}}
			>
			<div style={{position: 'relative'}}>
			<Toolbar disableGutters={false}>
				<Typography color="textPrimary" variant="h3" >
					WodTrackrr
				</Typography>

		    <section style={{marginLeft: "auto", marginRight: -12}}>
					<IconButton color="primary" onClick={this.handleToggle.bind(this)}>
						<Menu   />
					</IconButton>
					<Popper open={this.state.open} anchorEl={this.menuRef.current}
							  placement="bottom-end" transition disablePortal>
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
				<UserAlert id="headerAlert"  alertInfo={this.state.alertInfo} open={this.state.alertOpen}
					onCloseAlert={this.props.onCloseAlert} left={this.state.alertLeftPos}
				/>
			</div>
		</AppBar>
		)
	}
}



export default withTheme(Header);
