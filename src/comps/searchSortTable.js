// Firebase
import firebase from "../context/firebaseContext"
import "firebase/auth";
import "firebase/database";

// React
import React, { Component } from 'react'
import { Route, Link, Redirect } from 'react-router-dom';

import ReactMarkdown from 'react-markdown'

// Material UI
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import
{ 	Grid, Paper, IconButton, Typography, Collapse, TextField, Select,
	Accordion, AccordionSummary, AccordionDetails, FormControlLabel,
	CircularProgress, LinearProgress, CardActions, Card, CardContent,
	Modal, InputAdornment, TableBody, Table, TableContainer,
	TableHead, TableRow, TablePagination, TableSortLabel
} from '@material-ui/core';
import {TableCell as TC} from '@material-ui/core';

import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import SearchIcon from '@material-ui/icons/Search';
import { Alert } from '@material-ui/lab';
import { withTheme, withStyles } from '@material-ui/core/styles';

import {msToDate} from "../utils/formatting"



const TableCell = withStyles({root:{
	padding: "4px 0px 4px 4px"
}})(TC)


const WodRow = withStyles(theme => ({root:{
	margin: "8px 0px 8px 0px",
	padding: "4px 0px 4px 4px",
	backgroundColor: theme.palette.primary.main,
	borderRadius: "8px"
}}))(Grid)


function WodRaw(props){
	let title = props.info["title"]
	let scoreType = props.info["scoreType"]
	let wodText = props.info["wodText"]
	let boxID = props.info.boxID
	let wodID = props.info["wodID"]
	let gymClassID = props.info["gymClassID"]
	let date = props.info["date"]

	return(
		<WodRow container item xs={12} style={{margin: "8px 0px 8px 0px"}}
			onClick={(ev) => {
			let tagName = ev.target.tagName
			if(["path", "svg"].indexOf(tagName) > -1)
				return
			props.onViewScores(`/wod/${boxID}/${gymClassID}/${wodID}`)
		}}>

			<Grid item xs={10} align="left">
				<Typography variant="subtitle2" component="h2" gutterBottom style={{overflowWrap: "break-word"}} >
				{title}
				</Typography>
				<Typography variant="caption" component="h2"gutterBottom>
					{msToDate(date)}
				</Typography>
			</Grid>


			<Grid item alignItems="center" container xs={2} align="right" justify="center">

				{ props.showOwnerBtns ?
						<Grid item container xs={12}>
							<Grid item xs={6}>
								<IconButton size="small"
									color="secondary"
									onClick={() => props.handleEdit(props.info)}>
									<Edit />
								</IconButton>
							</Grid>
							<Grid item xs={6}>
								<IconButton size="small"
									onClick={() => props.handleRemove(props.info)}>
									<Delete color="error"/>
								</IconButton>
							</Grid>
						</Grid>
					:
					<React.Fragment></React.Fragment>
				}
			</Grid>
		</WodRow>
	)
}
const Wod = withTheme(WodRaw)

function EmptyWodRaw(props){
	return(
	  <Grid item xs={12} align="center">
		<Typography variant="subtitle1" color="primary">
		No Workouts!
		</Typography>
	  </Grid>
	)
  }
const EmptyWod = withTheme(EmptyWodRaw)

const StyledTablePagination = withStyles({
	root:{
		overflow: "hidden"
	},
	actions:{
		margin: "0px"
	}
})(TablePagination)

class SearchSortTable extends Component {
	constructor(props){
		super(props)
		this.state = {
			headers: props.headers,
			rows: props.rows,
			filteredRows: props.filteredRows,
			orderTableBy: "date",
			orderTable: "asc",
			pageNum: 0,
			rowsPerPage:5,
			pageStart: 0,
			pageEnd: 5,
			redirectUrl: "",
			redirect: false

		}
	}

	static getDerivedStateFromProps(props, state){
		return state.rows.length > 0? state: props
	}

	/*
		Search Table
	*/
	onKeyUp(data){
		if((data.keyCode || data.which) == 13){

		}
	}

	onChange(ev){
		let val = ev.target.value
		console.log(val)
		let filteredRows = this.state.rows.filter(wod =>{
		  return wod["title"].toLowerCase().includes(val.toLowerCase())
		})

		this.setState({filteredRows: filteredRows})
	}

	descendingComparator(a, b, orderBy) {
		if(b[orderBy] < a[orderBy]){
			return -1;
		}
		if(b[orderBy] > a[orderBy]){
			return 1;
		}
		return 0;
	}

	getComparator(order, orderBy) {
		return order === 'desc'
		? (a, b) => this.descendingComparator(a, b, orderBy)
		: (a, b) => -this.descendingComparator(a, b, orderBy);
	}

	stableSort(comparator) {
		let arr = this.state.filteredRows
		const stabilizedThis = arr.map((el, index) => [el, index]);

		stabilizedThis.sort((a, b) => {
			const order = comparator(a[0], b[0]);

			if (order !== 0) return order;
			return a[1] - b[1];
		});
		return stabilizedThis.map((el) => el[0]);
	}

	createSortHandler(orderBy){
		let isAsc =
			this.state.orderTableBy === orderBy &&
			this.state.orderTable === "asc"
		this.setState({
			orderTableBy: orderBy,
			orderTable: isAsc? "desc" : "asc"
		})
	}

	handleChangePage(ev, newPage){
		let start = newPage * this.state.rowsPerPage
		let end = (newPage * this.state.rowsPerPage) + this.state.rowsPerPage
		this.setState({
			pageNum: newPage,
			pageStart: start,
			pageEnd: end
		})
	}

	handleChangeRowsPerPage(ev){
		let rowsPerPage = parseInt(ev.target.value)
		console.log(rowsPerPage)
		this.setState({
			pageNum: 0,
			rowsPerPage: rowsPerPage,
			pageStart: 0,
			pageEnd: rowsPerPage
		})
	}


	onViewScores(url){

		this.setState({redirectUrl: url, redirect: true})
	}

  render(){
	return(
		<Grid item xs={12} align="center">
			{this.state.redirect?
				<Redirect to={this.state.redirectUrl} />
			:
				<React.Fragment></React.Fragment>
			}

		    <Paper style={{margin: "16px 0px 0px 0px"}} component="form">
			<TextField
			fullWidth
			variant="outlined"
			onKeyUp={this.onKeyUp.bind(this)}
			onChange={this.onChange.bind(this)}
			placeholder="Search"
			InputProps={{
			  startAdornment: (
			    <InputAdornment position="start">
			      <SearchIcon color="primary" />
			    </InputAdornment>
			  ),
			}}
			/>
			</Paper>

			<Grid container item xs={12}>
			<TableContainer style={{margin: "8px 0px 0px 0px"}}>
  			<Table>
			<TableHead>
		    	<TableRow>
		    	{
		    		this.state.headers.map((header, i)=>{
			        	return (
			        	<TableCell key={i}>
			        		{
			        			header.sortable?
					        		<TableSortLabel
						              active={header.id === this.state.orderTableBy}
						              direction={header.id === this.state.orderTableBy?  this.state.orderTable: "asc"}
						              onClick={()=>{ this.createSortHandler(header.id)}}
						            >
					        			{header.label}
							        </TableSortLabel>
							    :
							    	<React.Fragment>{header.label}</React.Fragment>
			        		}
			        	</TableCell>)
		    		})
		    	}
		    	</TableRow>
		    </TableHead>
			</Table>
			</TableContainer>

			{this.state.filteredRows.length > 0
			?
				this.stableSort(
					this.getComparator(
						this.state.orderTable,
						this.state.orderTableBy
					)
				)
				.slice(this.state.pageStart, this.state.pageEnd)
				.map((row, i) => {
					return <Wod key={i}
						handleView={this.props.handleView}
						handleRemove={this.props.handleRemove}
						handleEdit={this.props.handleEdit}
						info={row}
						showOwnerBtns={this.props.showOwnerBtns}
						onViewScores={this.onViewScores.bind(this)}
					/>
				})
			:

				<EmptyWod />

			}

			<StyledTablePagination
			rowsPerPageOptions={[5, 10, 25]}
			component={Grid}
			count={this.state.filteredRows.length}
			rowsPerPage={this.state.rowsPerPage}
			page={this.state.pageNum}
			onChangePage={this.handleChangePage.bind(this)}
			onChangeRowsPerPage={this.handleChangeRowsPerPage.bind(this)}
			/>
			</Grid>
			<Grid item xs ={12}>

			</Grid>
		</Grid>
	)
  }
}

export default SearchSortTable = withTheme(SearchSortTable)

