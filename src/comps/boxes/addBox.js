import React, { Component } from 'react'

import
{ 	Grid, Button, TextField,
}
from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';

import { setBox } from "../../utils/firestore/boxes"


class AddBox extends Component {
	constructor(props){
		super(props)
		this.state = {
			userMD: props.userMD,
			boxMD: {
					title: "",
					description: ""
			}
		}
	}

	componentDidMount(){
	}

	static getDerivedStateFromProps(props, state){
		return props
	}

	onKeyUp(data){
		if((data.keyCode || data.which) === 13){
			this.createBox()
		}
	}

	onChange(ev){
		let boxMD = this.state.boxMD
		const {name, value} = ev.target
		boxMD[name] = value
		this.setState({
				boxMD: boxMD
			})
	}

	createBox(){
		let title = this.state.boxMD.title
		let description = this.state.boxMD.description
		if(!title){
				this.props.onAlert({
					type: 'error',
					message: 'No title given'
				})
				return
		}
		setBox(title, description, this.props.userMD.uid)
		.then((res)=>{
				this.props.onAlert({
						type: "success",
						message: "Added gym!"
				})
		})
		.catch((err)=>{
			this.props.onAlert({
					type: "error",
					message: err
			})
		})
	}



	render () {
		return (
				<Grid item xs={12}>
					<Grid item xs={12}>
						<TextField
								name="title"
								value={this.state.boxMD.title}
								onKeyUp={this.onKeyUp.bind(this) }
								onChange={this.onChange.bind(this)}
								label="Name"
								margin="normal"
								color="primary"
								style={{width: "80%"}}
								/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="description"
							value={this.state.boxMD.description}
							onKeyUp={this.onKeyUp.bind(this) }
							onChange={this.onChange.bind(this)}
							label="Description"
							margin="normal"
							color="primary"
							style={{width: "80%"}}
						/>
					</Grid>
					<Grid item xs={12}>
						<Button size="small" variant="outlined" color="secondary"
							onClick={this.createBox.bind(this)}
							style={{margin: "16px auto", width: "90%" }}
						>
								Submit
						</Button>
					</Grid>
					</Grid>
		);
	}
}

export default AddBox = withTheme(AddBox);