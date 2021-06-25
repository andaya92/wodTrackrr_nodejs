import React, { Component } from 'react'

// Material UI
import
{ 	Grid, Typography, Tooltip, IconButton,
} from '@material-ui/core';

import clsx from 'clsx'

import { EditOutlined } from '@material-ui/icons';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import { withTheme, withStyles } from '@material-ui/core/styles';

import EditBoxInfo from "./editBoxInfo"

import { toDayYear } from "../../utils/formatting"


function Image(props){
	const { classes, children, className, ...other } = props

	return (<img className={clsx(classes.root, className)} alt="boxImage" {...other}
	/>)
}

const StyledImage = withStyles(theme =>({
	root: {
		width: "75%",
		margin: "0 auto",
		borderRadius: "8px"
	}
  }))(Image)


class BoxInfo extends Component {
	constructor(props){
		super(props)
		this.state = {
			userMD: props.userMD,
			boxID: props.boxID,
			boxMD: props.boxMD,
			editModalOpen: false
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
		let showEditBoxInfoBtn = this.state.userMD != null && this.state.boxMD['uid'] === this.state.userMD['uid']
		console.log(`Show edit btn? ${showEditBoxInfoBtn}`)
		return(
		<Grid item xs={12}>
			<Grid item xs={12}>
				<Grid item xs={12}>
					<Typography variant="h2">
						{this.state.boxMD.title}
					</Typography>
					<Typography variant="h4"
						style={{
							maxHeight: "20vh",
							overflowY: "auto"
						}}
					>
						{this.state.boxMD.description}
					</Typography>

				</Grid>
				<Grid item xs={12}>
					<Tooltip title="Change Location">
						<IconButton onClick={this.props.onLocation}
							style={{color: this.props.theme.palette.text.primary}}
						>
							<GpsFixedIcon />
						</IconButton>
					</Tooltip>
					{showEditBoxInfoBtn?
						<Tooltip title="Edit Desc">
							<IconButton onClick={this.openEditInfo.bind(this)}
								style={{color: this.props.theme.palette.text.primary}}>
								<EditOutlined />
							</IconButton>
						</Tooltip>
					:
						<React.Fragment></React.Fragment>
					}
					<Typography variant="caption">
						Joined: { toDayYear(new Date(this.state.boxMD.date)) }
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="subtitle2">
						{this.props.boxMD.location? this.props.boxMD.location: "Unknown Location"}
					</Typography>
				</Grid>
				<Grid item align="center" xs={12}>
					<StyledImage
						src={this.props.url}
					/>
				</Grid>
			</Grid>
			{
				showEditBoxInfoBtn?
					<EditBoxInfo
						open={this.state.editModalOpen}
						onClose={this.closeEditInfo.bind(this)}
						boxMD={this.state.boxMD}
						onAlert={this.props.onAlert}
					/>
				:
				 <React.Fragment></React.Fragment>
			}
        </Grid>
    )}
}

export default BoxInfo = withTheme(BoxInfo)