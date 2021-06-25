import React, { Component } from 'react'

// Material UI
import{
	Grid, Typography, IconButton
} from '@material-ui/core';

import clsx from 'clsx'

import { EditOutlined } from '@material-ui/icons';

import { withTheme, withStyles } from '@material-ui/core/styles';

import EditClassInfo from "./editClassInfo"

import { toDayYear } from "../../utils/formatting"



function Image(props){
	const { classes, children, className, ...other } = props

	return (<img className={clsx(classes.root, className)} alt="classImage" {...other}
	/>)
}

const StyledImage = withStyles(theme =>({
	root: {
		width: "100%",
		maxHeight: "15vh",
		margin: "0 auto",
		borderRadius: "8px"
	}
  }))(Image)


class ClassInfo extends Component {
	constructor(props){
		super(props)
		this.state = {
			userMD: props.userMD,
			gymClassMD: props.gymClassMD,
			editModalOpen: false,
			showEditClassInfoBtn: props.showEditBtn,
			url: props.url
		}
	}

	static getDerivedStateFromProps(props, state){
		return props
	}


	openEditInfo(){
		this.setState({editModalOpen: true})
	}



	closeEditInfo(){
        this.setState({editModalOpen: false})
    }

    render(){


		return(
		<Grid item xs={12}>
			<Grid item xs={12} align="left">
				<Typography variant="h2">
					{this.state.gymClassMD.boxTitle}
				</Typography>
				<Typography variant="h3">
					{this.state.gymClassMD.title}
				</Typography>
				<Typography variant="h4">
					{this.state.gymClassMD.description}
				</Typography>
				<Typography variant="caption">
					Created: { toDayYear(new Date(this.state.gymClassMD.date)) }
				</Typography>
				{this.state.showEditClassInfoBtn?
					<IconButton onClick={this.openEditInfo.bind(this)}
						style={{color: this.props.theme.palette.text.primary}}>
						<EditOutlined />
					</IconButton>
				:
					<React.Fragment></React.Fragment>
				}
				<Grid item align="center" xs={12}>
					<StyledImage
						src={this.state.url}
					/>
				</Grid>
			</Grid>
			{
				this.state.showEditClassInfoBtn?
					<EditClassInfo
						open={this.state.editModalOpen}
						onClose={this.closeEditInfo.bind(this)}
						gymClassMD={this.state.gymClassMD}
						onAlert={this.props.onAlert}
					/>
				:
				 <React.Fragment></React.Fragment>
			}
        </Grid>
    )}
}

export default ClassInfo = withTheme(ClassInfo)