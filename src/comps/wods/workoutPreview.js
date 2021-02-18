import React, { Component } from 'react'

import { Grid, Paper, Button, Typography, TextField }
from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Alert } from '@material-ui/lab';
import { withTheme, withStyles } from '@material-ui/core/styles';

import Delete from '@material-ui/icons/Delete'


function RowRaw(props){
  let textRaw = props.row.map(item => {
              let key = Object.keys(item)[0]
              return item[key]
            })
  console.log(textRaw)
  let text = textRaw.join(" ")

  return(
    <Grid item xs={12}>
      { text }
    </Grid>
  )
}

const Row = withTheme(RowRaw)

class WorkoutPreview extends Component {
  constructor(props){
    super(props)
    this.state = {
      rows: props.rows
    }
  }

  componentWillReceiveProps(newProps){
    this.setState({...newProps})
  }

  render(){
    return (
      <Grid item align="center">
        <Grid item xs={12}>
          {
            this.state.rows.map((row, i) => {
              console.log(row)
              return <Row row={row} key={i} />
              
            })
          }
        </Grid>
      </Grid>
    )
  }
}

export default WorkoutPreview = withTheme(WorkoutPreview)
