// Firebase
import firebase from "../../context/firebaseContext"
import "firebase/firestore"

// React
import React, { Component } from 'react'
import { withRouter } from "react-router-dom";

// Material UI
import
{ 	Grid, Paper, Typography, Modal, TableBody, Table,
	TableHead, TableRow, TableCell
} from '@material-ui/core'

import { withTheme, withStyles } from '@material-ui/core/styles'

import "../../styles.css"

const fs = firebase.firestore()

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
		let tmp = [...Array(10).keys()]
		console.log(tmp)
		this.state = {
      		classes: props.classes,
			testData: tmp.map(el => {
				return createData(el)
			})
		}
	}

	static getDerivedStateFromProps(props, state){
		return props
	}

	onView(redirectUrl){
			this.props.history.push(redirectUrl)
	}

  render(){
	  console.log(this.state.testData)
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
							{this.state.testData.map((classAdmin, i) => {

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