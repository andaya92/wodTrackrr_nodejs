import React, { Component } from 'react'

import { withTheme } from '@material-ui/core/styles';

import { Grid, Button, Typography }from '@material-ui/core';

import makeCancelable from "../../utils/promises"
import { CheckCircleOutlined } from "@material-ui/icons";

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
                      <Typography>
                          Email
                      </Typography>
                    </Grid>
                    <Grid item align="center" xs={6}>
                        <Typography>
                            {this.state.user.email}
                        </Typography>
                    </Grid>
                </Grid>

                {!this.state.user.emailVerified ?
                    <Grid item xs={12} align="center" style={{margin: "16px 0px 0px 0px "}}>
                      <Button variant="outlined" color="primary" style={{margin: "0px 0px 4px 0px "}}
                        onClick={this.sendVerificationEmail.bind(this)} >
                        <Typography  variant="subtitle2">
                          Send Verification Email
                        </Typography>
                      </Button>
                    </Grid>
                  :
                  <Grid item xs={12} align="center" style={{margin: "16px 0px 0px 0px "}}>
                    <Typography gutterBottom>Email Verified <CheckCircleOutlined /></Typography>
                  </Grid>
                  }
            </Grid>
        )
    }
}

export default UserEmail = withTheme(UserEmail)