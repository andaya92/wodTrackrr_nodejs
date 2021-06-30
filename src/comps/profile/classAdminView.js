// React
import React, { Component } from 'react'
import { withRouter } from "react-router-dom";

// Material UI
import{
	Typography, TableBody, Table, TableHead, TableRow, TableCell
} from '@material-ui/core'
import { withTheme, withStyles } from '@material-ui/core/styles'

import "../../styles.css"

function createData(testID){
	return{
		classTitle: `Test class ${testID}`,
		boxTitle: `Test Box ${testID}`,
		boxID: "Test",
		redirectUrl: ""
	}
}


const StyledTableCell = withStyles({root:{
	borderBottom: "none"
}})(TableCell)

function AdminRowRaw(props){
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
const AdminRow = withTheme(AdminRowRaw)

class ClassAdminView extends Component {
	constructor(props){
		super(props)
		this.state = {
			classes: props.classes
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
					<Table size="small" stickyHeader>
						<TableHead >
							<TableRow>
								<StyledTableCell align="left">Gym</StyledTableCell>
								<StyledTableCell align="left">Class</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{this.state.classes.map((classAdmin, i) => {
								return (
									<AdminRow key={i}
										info={classAdmin}
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

export default ClassAdminView = withRouter(withTheme(ClassAdminView))