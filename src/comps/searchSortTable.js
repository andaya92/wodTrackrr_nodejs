// Firebase
import firebase from "../context/firebaseContext"
import "firebase/auth";
import "firebase/database"; 

// React
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom';

import ReactMarkdown from 'react-markdown'

// Material UI
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import 
{ 	Grid, Paper, Button, Typography, Collapse, TextField, Select,
	Accordion, AccordionSummary, AccordionDetails, FormControlLabel,
	CircularProgress, LinearProgress, CardActions, Card, CardContent,
	Modal, InputAdornment, TableBody, Table, TableCell, TableContainer,
	TableHead, TablePagination, TableRow, TableSortLabel
} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';
import { Alert } from '@material-ui/lab';
import { withTheme } from '@material-ui/core/styles';

import {msToDate} from "../utils/formatting"

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
			pageEnd: 5

		}
	}

	componentWillReceiveProps(newProps){
		this.setState({...newProps})
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
		  return wod.get("title").toLowerCase().includes(val.toLowerCase())
		})

		this.setState({filteredRows: filteredRows})
	}

	/*
		Sort Table
	*/ 
	descendingComparator(a, b, orderBy) {
		if (b.get(orderBy) < a.get(orderBy)) {
			return -1;
		}
		if (b.get(orderBy) > a.get(orderBy)) {
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




  render(){
	return(
		<Grid item xs={12} align="center">
		<Paper elevation={2}>
		    <Paper elevation={2} component="form">
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
			<TableContainer>
  			<Table>
			<TableHead>
		    	<TableRow>
		    	{
		    		this.state.headers.map((header)=>{
			        	return (
			        	<TableCell>
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

		    <TableBody>
				{this.state.filteredRows.length > 0
				?
					this.stableSort(
						this.getComparator(
							this.state.orderTable,
							this.state.orderTableBy
						)
					)
					.slice(this.state.pageStart, this.state.pageEnd)
					.map(row => {
						return <Wod 
							handleView={this.props.handleView}
							handleRemove={this.props.handleRemove}
							handleEdit={this.props.handleEdit}
							info={row}
							showOwnerBtns={this.props.showOwnerBtns}
						/>
					})
				:
					
					<span>No data!</span>
					
				}
		    </TableBody>
  			</Table>
		    </TableContainer>
		     <TablePagination
	          rowsPerPageOptions={[5, 10, 25]}
	          component="div"
	          count={this.state.filteredRows.length}
	          rowsPerPage={this.state.rowsPerPage}
	          page={this.state.pageNum}
	          onChangePage={this.handleChangePage.bind(this)}
	          onChangeRowsPerPage={this.handleChangeRowsPerPage.bind(this)}
	        />
			</Grid>
		</Paper>
		</Grid>
	)
  }
}

function Wod(props){
	let title = props.info.get("title")
	let scoreType = props.info.get("scoreType")
	let wodText = props.info.get("wodText")
	let date = props.info.get("date")
	return(
		<TableRow>
			<TableCell>
				<Typography variant="h5" component="h2"gutterBottom>
					{msToDate(date)}
				</Typography>
			</TableCell>
			<TableCell>
				<Typography variant="h5" component="h2"gutterBottom>
					{title}
				</Typography>
			</TableCell>
			<TableCell>
				<Typography variant="h5" component="h2"gutterBottom>
					{scoreType}
				</Typography>
			</TableCell>
			<TableCell>
				<Typography variant="h5" component="h2"gutterBottom>
					<ReactMarkdown>{wodText}</ReactMarkdown>
				</Typography>
			</TableCell>
			<TableCell>
				<Button size="small" color="primary" 
					onClick={() => props.handleView(props.info)}>
					View Scores
				</Button>
			</TableCell>
			<React.Fragment>
			{
	  			props.showOwnerBtns
	  			?
				<TableCell>
			    <Button size="small" 
			    	color="secondary" 
			    	onClick={() => props.handleEdit(props.info)}>
			    	Edit
			    </Button>
				</TableCell>
		  		:
		  		<React.Fragment></React.Fragment>
	  		}
	  		</React.Fragment>

			<React.Fragment>
			{
	  			props.showOwnerBtns
	  			?
				<TableCell>
			    <Button size="small" 
			    	color="error" 
			    	onClick={() => props.handleRemove(props.info)}>
			    	Remove
			    </Button>
				</TableCell>
		  		:
		  		<React.Fragment></React.Fragment>
	  		}
	  		</React.Fragment>
		</TableRow>
	)
}

export default SearchSortTable = withTheme(SearchSortTable);