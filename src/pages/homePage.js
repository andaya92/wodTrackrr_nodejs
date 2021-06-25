import React, { Component } from 'react'

import { Grid, Paper, Typography }from '@material-ui/core'

import { withTheme } from '@material-ui/core/styles'


class HomePage extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  componentDidMount(){
  }

  static getDerivedStateFromProps(props, state){
    return props
  }

  render () {

    return (
    	<Grid item align="center" xs={12}>
          <Paper>
            <Grid item xs={3}></Grid>
            <Grid item xs={6}>
                <Typography variant="h3">Find a gym</Typography>
                <Typography variant="h3">Track your results</Typography>
                <Typography variant="h3">Show top gys here</Typography>
                <Typography variant="h3">Show events local to the user here</Typography>
                <img className="img-responsive" alt="nike" src="nike.png"/>

            </Grid>
          </Paper>
  		</Grid>
    );
  }
}

export default HomePage = withTheme(HomePage)
