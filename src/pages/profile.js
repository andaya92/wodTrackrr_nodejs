import React, { Component } from 'react'

import { Grid, Paper, Button, Typography, Collapse,
        Accordion, AccordionSummary, AccordionDetails }
from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';


import NewOwnerBox from "../comps/topNavigation"
import UsernamePanel from "../comps/profile/usernamePanel"
import UserFollows from '../comps/followers/userFollows'
import Athlete from '../comps/profile/athlete'

class PageContentRaw extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      emailAlertOpen: false
    }
  }

  componentWillReceiveProps(newProps){
    this.setState({...newProps})
  }
  
  sendVerificationEmail(){
    this.state.user.sendEmailVerification()
    .then( () => {
        this.setState({emailAlertOpen: true})
    })
    .catch( err => {console.log(err)})
  }

  render(){
    return (
      <Grid item container align="center">
        <Grid item xs={12}>
          <Collapse in={this.state.emailAlertOpen}>
            <Alert onClose={() => {this.setState({emailAlertOpen: false})}}>
              Email sent!
            </Alert>
          </Collapse>
        </Grid>
        <Grid item xs={12}> 
          <Grid item container xs={12}>
              {!this.state.user.emailVerified ?
                <Grid item xs={12}>
                  <Paper elevation={4}>
                    <Typography >
                      Verification
                    </Typography>         
                    
                    <Button variant="outlined" 
                      onClick={this.sendVerificationEmail.bind(this)} >
                      <Typography  variant="h5" component="h3">
                        Send Verification Email
                      </Typography>
                    </Button>
                  </Paper>
                </Grid>
              :
                <React.Fragment></React.Fragment>
              }

              <Grid item xs={12} style={{margin: "16px 0px 0px 0px "}}>
                <Paper elevation={4}>   
                  <UsernamePanel user={this.state.user} userMD={this.state.userMD} />
                </Paper>
              </Grid>
                
             <Grid item xs={12} style={{margin: "16px 0px 0px 0px "}}>
               <Paper elevation={4}>       
                <UserFollows
                  user={this.state.user}
                  userMD={this.state.userMD}
                 />
               </Paper>
              </Grid>
        </Grid>

        <Paper elevation={2} style={{margin: "8px 0px 0px 0px"}}>
          {this.state.userMD.accountType === "owner" ?
            <NewOwnerBox user={this.state.user} userMD={this.state.userMD} />
          :
            <Athlete user={this.state.user} userMD={this.state.userMD} />
          }
          </Paper>
        </Grid>   
    </Grid>
    )
  }
}

const PageContent = withTheme(PageContentRaw)

class ProfilePage extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD
    }  
  }
 
  /*
    login.js has the form and does the login, calls this with the user obj
  */
  handleLogIn(user){
      this.setState({user: user} )
  }

  componentWillReceiveProps(newProps){
    this.setState({...newProps})
  }

  render () {
    return (
    	<Grid item xs={12} id="profilepage">
          ? <PageContent 
                user= {this.state.user}
                userMD={this.state.userMD}
            />
  		</Grid>
    );
  }
}

export default ProfilePage = withTheme(ProfilePage)
