import React, { Component } from 'react'

import { Grid, Paper, Button, Typography, TextField, Select }
from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Alert } from '@material-ui/lab';
import { withTheme, withStyles } from '@material-ui/core/styles';

import Delete from '@material-ui/icons/Delete'
import Close from '@material-ui/icons/Close'

const TITLE = "title"
const AMOUNT = "amount"
const UNIT = "unit"
const UNITS = ["cm", "in", "ft", "M", "Mi", "mins", "secs", "lb", "kg"]


function TitleRaw(props){
  return(
    <Grid item xs={6}>
      <TextField
        type="text"
        pattern="[\sA-Za-z0-9]{35}"
        InputProps={{
          title: "Letters only, max length 35",
          placeholder: "Title",
          endAdornment: <Close fontSize="small" onClick={(ev)=> {
              props.onRemove(props.colIndex, props.colIndexKey) 
            }} />
        }}
        value={props.value}
        margin="small"
        color="primary"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(ev) => { 
          console.log("onchangeTextField")
            props.onUpdate(props.colIndex, props.colIndexKey, ev.target.value) 
        }}
      />
    </Grid>
  )
}

function AmountRaw(props){
  return(
    <Grid item xs={6}>
    <TextField
      type="number"
      pattern="[\sA-Za-z0-9]{35}"
      InputProps={{
        title: "Numbers only",
        placeholder: "Amount",
        endAdornment: <Close onClick={(ev)=> {
            props.onRemove(props.colIndex, props.colIndexKey) 
          }}/>
      }}
      value={props.value}
      margin="small"
      color="primary"
      InputLabelProps={{
        shrink: true,
      }}
      onChange={(ev) => { 
          props.onUpdate(props.colIndex, props.colIndexKey, ev.target.value) 
      }}
    />
    </Grid>
  )
}
function UnitRaw(props){
  return(
    <Grid item container xs={4}>
      <Grid item xs={11}>
      <Select native
        margin="small"
        color="primary"
        InputProps={{
          name: 'gymClass',
          id: 'AddWodGymClassID'
        }}
        onChange={(ev) => { 
              props.onUpdate(props.colIndex, props.colIndexKey, ev.target.value) 
        }}>
          {
              UNITS.map((unit, i) => {
              return (<option key={i} value={unit} >
                        {unit}
                      </option>)
            })
          }
        </Select>
      </Grid>
      <Grid item xs={1} align="left">
        <Close onClick={(ev)=> {
                props.onRemove(props.colIndex, props.colIndexKey) 
        }}/>
      </Grid>
    </Grid>
  )
}

const Title = withTheme(TitleRaw)
const Amount = withTheme(AmountRaw)
const Unit = withTheme(UnitRaw)

class RowRaw extends Component{
  
  constructor(props){
    super(props)
    this.state = {
      row: props.row,
      index: props.index,
      colIndex: 0,
      selected: props.selected
    }
  }

  componentWillReceiveProps(newProps){
    this.setState({...newProps})
  }

  onUpdate(colIndex, key, value){
    let row = this.state.row
    row[colIndex][key] = value
    this.setState({row: row})
    this.props.onRowUpdate(this.state.index, row)
  }

  onRemove(colIndex, key){
    console.log("Removing", colIndex, key)
    let row = this.state.row
    delete row[colIndex][key]
    this.setState({row: row})
    this.props.onRowUpdate(this.state.index, row) 
  }

  render(){
    
    return(
      <Grid item xs={12}
            onClick={(ev) =>{
              this.props.onClick(this.state.index)
            }}
            style={{
              margin: "0px 0px 8px 0px ",
              border: `2px solid ${this.props.theme.palette.primary.main}`,
              'border-radius': '6px'
      }}>
      <Paper
             style={{ 
                background: this.state.selected? this.props.theme.palette.primary.main: "" 
      }}>
      <Grid item container xs={12} align="center">
        <Grid item container spacing={4} align="left" xs={11}>
            {
              this.state.row.map((obj, i) => {
                let key = Object.keys(obj)[0]
                switch(key){
                  case TITLE:
                    return <Title key={i} 
                      onUpdate={this.onUpdate.bind(this)}
                      onRemove={this.onRemove.bind(this)}
                      value={obj[key]}
                      colIndex={i}
                      colIndexKey={TITLE}
                    />
                    break
                  case AMOUNT:
                    return <Amount key={i} 
                      onUpdate={this.onUpdate.bind(this)}
                      onRemove={this.onRemove.bind(this)}
                      value={obj[key]}
                      colIndex={i}
                      colIndexKey={AMOUNT}
                    />
                    break
                  case UNIT:
                    return <Unit key={i} 
                      onUpdate={this.onUpdate.bind(this)}
                      onRemove={this.onRemove.bind(this)}
                      value={obj[key]}
                      colIndex={i}
                      colIndexKey={UNIT}
                    />
                    break
                  default:
                    break
                }
              })
            }
            </Grid>
            <Grid item xs={1} container align="center"
            justify="center"
            direction="column" >
              <Grid item xs ={12} >
                <Delete color="error" style={{margin: "0 auto"}}
                    onClick={(ev) => {
                      this.props.onRemove(this.state.index)
                }}/>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        </Grid>
    )
  }
}

const Row = withTheme(RowRaw)

class Workout extends Component {
  constructor(props){
    super(props)
    this.state = {
      rows: [],
      index: 0
    }
  }

  componentWillReceiveProps(newProps){
    this.setState({...newProps})
    if(newProps.submit){
      this.onRowSubmit()
    }
  }

  onRowClick(rowIndex){
    this.setState({index: rowIndex})
  }

  addRow(){
    let rows = this.state.rows
    rows.push([])
    this.setState({rows: rows, index: rows.length - 1})
  }

  removeRow(rowIndex){
    let rows = this.state.rows
    let newRows = rowIndex == 0 ?
                  rows.slice(1) :
                  [...rows.slice(0, rowIndex), ...rows.slice(rowIndex + 1)]

    this.setState({rows: newRows})
    this.updateParent(newRows)
  }

  addItem(item){
    if(!this.state.rows.length > 0)
      return
    let rows = this.state.rows
    let row = rows[this.state.index]
    let obj = {}
    obj[item] = ""
    row.push(obj)
    rows[this.state.index] = row
    
    this.setState({rows: rows})
  }  

  onRowSubmit(){
    this.props.onSubmit(this.state.rows)
  }

  onRowUpdate(index, row){
    console.log("Row updated!")
    console.log(row)
    let rows = this.state.rows
    rows[index] = row
    this.setState({rows: rows})
    this.updateParent(rows)
  }

  updateParent(rows){
      this.props.onUpdate(rows) // update addWod w/ rows
  }

  render(){
    return (
      <Grid item align="center">
        <Grid item xs={12}>
          <Button onClick={this.addRow.bind(this)}>+Row</Button>
          <Button onClick={() => { this.addItem(AMOUNT) }} >
            +Amount
          </Button>
          <Button onClick={() => { this.addItem(TITLE) }} >
            +Title
          </Button>
          <Button onClick={() => { this.addItem(UNIT) }} >
            +Unit
          </Button>
        </Grid>

        <Grid item id="workoutText" xs={12}>
          {
            this.state.rows.map((row, i) => {
              console.log(`Row: ${i}`)
              console.log(row)
              return <Row key={i} index={i} row={row} 
              selected={this.state.index == i}
              onClick={this.onRowClick.bind(this)}
              onRemove={this.removeRow.bind(this)}
              onRowUpdate={this.onRowUpdate.bind(this)}
              theme={this.props.theme}/>
            })
          }
        </Grid>
      </Grid>
    )
  }
}

export default Workout = withTheme(Workout)
