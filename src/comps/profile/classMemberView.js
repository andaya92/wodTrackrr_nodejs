// React
import React, { Component } from 'react'
import { withRouter } from "react-router-dom"

// Material UI
import{
		Typography, TableBody, Table, TableHead, TableRow, TableCell
} from '@material-ui/core'
import { withTheme, withStyles } from '@material-ui/core/styles';

/*
	Given:
		userMD: props.userMD,
		boxID: props.boxID,
	Show:
		details of Box and its WODS, allows for removal of wods by owner
*/

const StyledTableCell = withStyles({root:{
	borderBottom: "none"
}})(TableCell)


function MemberRowRaw(props){
	let gymClassTitle = props.info.classTitle
	let boxTitle = props.info.boxTitle
	let boxID = props.info.boxID
	let redirectUrl = `class/${boxID}/${props.info.gymClassID}`

	return(
		<TableRow onClick={ (ev) => props.onView(redirectUrl)}>
			<StyledTableCell>
				<Typography color="primary">
					{boxTitle}
				</Typography>
			</StyledTableCell>
			<StyledTableCell>
				<Typography color="primary">
					{gymClassTitle}
				</Typography>
			</StyledTableCell>
		</TableRow>
	)
}
const MemberRow = withTheme(MemberRowRaw)

class ClassMemberView extends Component {
	constructor(props){
		super(props)
		this.state = {
    	classes:props.classes
		}
	}

	static getDerivedStateFromProps(props, state){
		return props
	}

	onView(redirectUrl){
			this.props.history.push(redirectUrl)
	}

  render(){
		return(
			<React.Fragment>
				{this.state.classes.length > 0?
					<Table size="small">
						<TableHead>
							<TableRow>
								<StyledTableCell align="left">Gym</StyledTableCell>
								<StyledTableCell align="left">Class</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{this.state.classes.map((classMember, i) => {
								return (
									<MemberRow key={i}
										info={classMember}
										onView={this.onView.bind(this)}
									/>)
							})}
						</TableBody>
					</Table>
				:
					<React.Fragment></React.Fragment>
				}
			</React.Fragment>
    )
	}
}

export default ClassMemberView = withRouter(withTheme(ClassMemberView))