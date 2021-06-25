import firebase from "../../context/firebaseContext"
import "firebase/auth"
import "firebase/firestore"
import { withRouter } from "react-router-dom"

import React, { Component } from 'react'
import { Grid, TextField, Button, Paper, Typography } from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles'

class RegisterUser extends Component {
  constructor(props){
    super(props)
    this.state = {
		redirect: false,
		registerInfo: {}
	}
  }

  componentDidMount(){
  }

  handleSubmit(ev){
    let username = this.state.registerInfo.username
	let email = this.state.registerInfo.email
    let pass1 = this.state.registerInfo.password
    let pass2 = this.state.registerInfo.passwordConfirm

    console.log(username, email, pass1, pass2)
	if(pass1 !== pass2){
		this.props.onAlert({
			type: "error",
			 message: "Passwords do not match"
		  })
	}else if(!email){
		this.props.onAlert({
			type: "error",
			 message: "Missing E-mail"
		  })
	}else if(!username){
		this.props.onAlert({
			type: "error",
			 message: "Missing Username"
		  })
	}else if(pass1 === pass2 && username && email){
    	firebase.auth().createUserWithEmailAndPassword(email, pass1)
      	.then(res => {
        	console.log(res)
			let fs = firebase.firestore()
			let data = {
			username: username,
			admin: false,
			uid: res.user.uid,
			accountType: "athlete"
			}

			fs.collection('users').doc(res.user.uid).set(data)
			.then( () => {
				this.props.onAlert({
					type: "success",
					 message: "Registered. Verify your email!"
				  })
				this.props.history.push("/profile")
			})
      	})
      	.catch(err => {
        	this.props.onAlert({
				type: "error",
				 message: err.message
			  })
      	})
    }else{
	  this.props.onAlert({
		  type: "error",
		   message: "Passwords do not match"
		})
    }
  }

  goToLogin(){
	  this.props.history.push("/login")
  }

  onChange(ev){
	  const { name, value } = ev.target
	  let registerInfo = this.state.registerInfo
	  registerInfo[name] = value
	  this.setState({registerInfo: registerInfo})
  }

  render () {
    return (
		<Grid container id="login" align="center" justify="center">
       		<Grid item xs={12} style={{top: "20%", position: "absolute"}}>
			<Paper elevation={2}>
				<Typography variant="h4">
					Register
				</Typography>

				<TextField
					name="username"
					type="text"
					onChange={this.onChange.bind(this)}
					style={{ margin: 8 }}
					placeholder="Username"
					margin="normal"
					InputLabelProps={{
						shrink: true,
					}}
				/><br /><br />

				<TextField
					name="email"
					type="email"
					onChange={this.onChange.bind(this)}
					style={{ margin: 8 }}
					placeholder="Email"
					margin="normal"
					InputLabelProps={{
						shrink: true,
					}}
				/><br /><br />

				<TextField
					name="password"
					type="password"
					onChange={this.onChange.bind(this)}
					style={{ margin: 8 }}
					placeholder="Password"
					margin="normal"
					InputLabelProps={{
					shrink: true,
					}}
				/><br/><br/>

				<TextField
					name="passwordConfirm"
					type="password"
					style={{ margin: 8 }}
					placeholder="Confirm Password"
					margin="normal"
					onChange={this.onChange.bind(this)}
					InputLabelProps={{
					shrink: true,
					}}
				/> <br/><br/>

				<Grid item container xs={12} >
					<Grid item xs={6} >
						<Button variant="outlined" color="secondary" onClick={this.goToLogin.bind(this)}>
						Login
						</Button>
					</Grid>
					<Grid item xs={6} >
						<Button variant="outlined" color="primary" onClick={this.handleSubmit.bind(this)}>
						Submit
						</Button>
					</Grid>
				</Grid>
			</Paper>
			</Grid>
		</Grid>
    );
  }
}

export default RegisterUser = withRouter(withTheme(RegisterUser))