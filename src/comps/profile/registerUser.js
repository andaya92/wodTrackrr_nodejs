import firebase from "../../context/firebaseContext"
import "firebase/auth"
import "firebase/firestore";
import { withRouter } from "react-router-dom";

import React, { Component } from 'react'
import { Grid, TextField, Button, Paper } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { withTheme } from '@material-ui/core/styles';

class RegisterUser extends Component {
  constructor(props){
    super(props)
    this.state = {redirect: false}
  }

  componentDidMount(){
  }

  handleSubmit(ev){
    let email = document.getElementById('email')

    let pass1 = document.getElementById('password')
    let pass2 = document.getElementById('passwordConfirm')

    console.log(email.value, pass1.value)


    if(pass1.value === pass2.value){
      firebase.auth().createUserWithEmailAndPassword(email.value, pass1.value)
      .then(res => {
        console.log(res)
        let fs = firebase.firestore();
        let data = {
          username: "",
          admin: false,
          uid: res.user.uid,
          accountType: "athlete"
        }

        fs.collection('users').doc(res.user.uid).set(data)
		.then( () => {
			console.log("Set user data.")
			this.props.history.push("/profile")
		})
      })
      .catch(err => {
        console.log(err)
      });
    }else{
      alert("Passwords do not match")
    }
  }

  render () {
    return (
		<Grid container xs={12} id="login" align="center" justify="center">
			<Paper elevation={2}>
				<br />
				<Grid item xs={12} ><h1>Register</h1></Grid>
				<br />

				<Grid item xs={12} >
					<TextField
					id="email"
					style={{ margin: 8 }}
					placeholder="Email"
					margin="normal"
					InputLabelProps={{
						shrink: true,
					}}
					/><br /><br />
				</Grid>

				<Grid item xs={12} >
					<TextField
						id="password"
						type="password"
						style={{ margin: 8 }}
						placeholder="Password"
						margin="normal"
						InputLabelProps={{
						shrink: true,
						}}
					/>
						<br/><br/>
				</Grid>

				<Grid item xs={12} >
					<TextField
						id="passwordConfirm"
						type="password"
						style={{ margin: 8 }}
						placeholder="Confirm Password"
						margin="normal"
						InputLabelProps={{
						shrink: true,
						}}
					/> <br/><br/>
				</Grid>
				<Grid item xs={12} >
					<Button variant="outlined" color="primary" onClick={this.handleSubmit.bind(this)}>
					Submit
					</Button>
				</Grid>
			</Paper>
		</Grid>
    );
  }
}



export default RegisterUser = withRouter(withTheme(RegisterUser))