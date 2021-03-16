import firebase from "../../context/firebaseContext"
import "firebase/firestore"

import React, { Component } from 'react'

import { withTheme, withStyles } from '@material-ui/core/styles';

import { Grid, Paper, Button, Typography, Collapse,
        Accordion, AccordionSummary, AccordionDetails }
from '@material-ui/core';

import makeCancelable from "../../utils/promises"



class UserEmail extends Component{
    constructor(props){
        super(props)
        this.state = {
            user: props.user
        }
    }

    sendVerificationEmail(){
        let emailVerifyPromise = new Promise(
          (res, rej) => {
          this.state.user.sendEmailVerification()
          .then(() => {
                console.log("Sent Email verification.")
                this.props.onAlert({
                    type: "success",
                    message: "Sent email verification"
                })
          })
          .catch( err => {
            this.props.onAlert({
                type: "error",
                message: err.message
            })
           })
        })

        this.cancelablePromise = makeCancelable(emailVerifyPromise)
      }

    render(){
        return(
            <Grid item  xs={12}>
                <Grid item container xs={12}>
                    <Grid item xs={6} align="center">
                    <Paper>
                        <Typography>
                            Email
                        </Typography>
                    </Paper>

                    </Grid>
                    <Grid item xs={6}>
                        <Paper>
                            <Typography>
                                {this.state.user.email}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {!this.state.user.emailVerified ?
                    <Grid item xs={12} align="center" style={{margin: "16px 0px 0px 0px "}}>
                      <Paper elevation={4}>
                        <Typography >
                          Verification
                        </Typography>

                        <Button color="secondary" style={{margin: "0px 0px 4px 0px "}}
                          onClick={this.sendVerificationEmail.bind(this)} >
                          <Typography  variant="subtitle2">
                            Send Verification Email
                          </Typography>
                        </Button>
                      </Paper>
                    </Grid>
                  :
                    <React.Fragment></React.Fragment>
                  }
            </Grid>

        )
    }
}

export default UserEmail = withTheme(UserEmail)