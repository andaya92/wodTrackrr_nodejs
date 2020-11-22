import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom';
import { Grid, Button } from '@material-ui/core';


import ResetPassword from "../comps/resetPassword"


export default class ResetPasswordPage extends Component {
  constructor(props){
    super(props)
    this.state = {user: null, redirect: false}
  }

	componentDidMount(){
	}

  
  handleSubmit(){
    this.setState({redirect: true})
  }

  render () {
    return (
    	<React.Fragment>
      {
        this.state.redirect
        ? <Redirect to="/profile" />
        : <Grid item xs={12}>
            <ResetPassword user={this.state.user} onReset={this.handleSubmit.bind(this)}/>
          </Grid>
      }
         <Grid item xs={12} align="center"><br />
          <Link to="/settings" className="no-line">
            <Button variant="outlined" color="primary">
              Back to Settings
            </Button>
          </Link>
        </Grid>
      </React.Fragment>
    );
  }
}

