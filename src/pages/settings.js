import React, { Component } from 'react'

import
{ 	Grid, Typography, TableRow, TableHead,
	TableBody, Table, TableCell, IconButton
}
from '@material-ui/core';

import { withTheme } from '@material-ui/core/styles';
import { ArrowBackIos } from '@material-ui/icons';

import ResetPassword from "../comps/settings/resetPassword"
import DeleteAccount from "../comps/settings/deleteAccount"
import UsernamePanel from "../comps/settings/usernamePanel"
import BackButton  from "../comps/backButton"
import UserEmail from "../comps/settings/userEmail"

const HOME = "home"
const CHANGE_USERNAME = "change username"
const CHANGE_PASSWORD = "change password"
const DELETE_ACCOUNT = "delete account"
const EMAIL = "email"


function SettingsRowRaw(props){
    return(
        <TableRow hover onClick={() => { props.openSetting(props.info.id) }}>
            <TableCell align="left" colSpan={2}>
                {props.info.title}
            </TableCell>
        </TableRow>
    )
}

const SettingsRow = withTheme(SettingsRowRaw)




class Settings extends Component {
  constructor(props){
    super(props)
    this.state = {
        user: props.user,
        userMD: props.userMD,
        currentPage: HOME
    }

    this.settings = [
        {
            id: CHANGE_USERNAME,
            title: "Change Username",

        },
        {
            id: EMAIL,
            title: "Email",

        },
        {
            id: CHANGE_PASSWORD,
            title: "Change Password",

        },
        {
            id: DELETE_ACCOUNT,
            title: "Delete Account",

        },
    ]
  }

  componentDidMount(){
  }

  static getDerivedStateFromProps(props, state){
    return props
  }

  openSetting(id){
      console.log("clicked ", id)
    this.setState({
        currentPage: id
    })
  }

  handleBack(){
      this.setState({currentPage: HOME})
  }

  render () {
    return (
    	<Grid item xs={12}>
            {this.state.currentPage === HOME?
                <Grid item xs={12}>
                    <BackButton />
                    <Table>
                        <TableHead>
                            <TableRow>
                                    <TableCell align="center" colSpan={2}>
                                        <Typography gutterBottom variant="h3">
                                            Settings
                                        </Typography>
                                    </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.settings.map((setting, i) => {
                                return(
                                    <SettingsRow key={i}
                                        info={setting}
                                        openSetting={this.openSetting.bind(this)}
                                    />
                                )
                            })}
                        </TableBody>
                    </Table>
                </Grid>
            : this.state.currentPage === CHANGE_PASSWORD?
                <Grid container item xs={12}>
                    <Grid item xs={12}>
                        <IconButton style={{color: this.props.theme.palette.text.primary}} onClick={this.handleBack.bind(this)}>
                            <ArrowBackIos />
                        </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                        <ResetPassword user={this.state.user} />
                    </Grid>

                </Grid>
            : this.state.currentPage === DELETE_ACCOUNT?
                <Grid container item xs={12}>
                    <Grid item xs={12}>
                        <IconButton style={{color: this.props.theme.palette.text.primary}} onClick={this.handleBack.bind(this)}>
                            <ArrowBackIos />
                        </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                        <DeleteAccount user={this.state.user} />
                    </Grid>

                </Grid>
            : this.state.currentPage === CHANGE_USERNAME?
                <Grid container item xs={12}>
                    <Grid item xs={12}>
                        <IconButton style={{color: this.props.theme.palette.text.primary}} onClick={this.handleBack.bind(this)}>
                            <ArrowBackIos />
                        </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                    <UsernamePanel
                        userMD={this.state.userMD}
                        onAlert={this.props.onAlert}
                    />
                    </Grid>
                </Grid>
            : this.state.currentPage === EMAIL?
            <Grid container item xs={12}>
                <Grid item xs={12}>
                    <IconButton style={{color: this.props.theme.palette.text.primary}} onClick={this.handleBack.bind(this)}>
                        <ArrowBackIos />
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                    <UserEmail
                        user={this.state.user}
                        onAlert={this.props.onAlert}
                    />
                </Grid>
            </Grid>
            :
                <span>Default</span>
            }
  		</Grid>
    );
  }
}

export default Settings = withTheme(Settings);