import firebase from "../context/firebaseContext"
import "firebase/auth";
import "firebase/database";

import React, { Component } from 'react'

import { Grid, Paper, Typography} from '@material-ui/core';

import { withTheme } from '@material-ui/core/styles';
import BoxSearch from "../comps/boxes/boxSearch"

import "../styles.css"

let fs = firebase.firestore()

class BoxSearchPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      allBoxes: []
    }
  }

  componentDidMount(){
    this.allBoxesListener = fs.collection("boxes")
    .onSnapshot(ss => {
      if(!ss.empty){
        let boxes = []
        ss.forEach(doc => {
          // console.log(doc.data())
          boxes.push(doc.data())
        })
        // boxes.sort((x, y) => {
        //   return x["title"].toLowerCase() > y["title"].toLowerCase() ? -1 : 1
        // })
        this.setState({
          allBoxes: boxes
        })
      }
    })
  }

  componentWillUnmount(){
    if(this.allBoxesListener){
      this.allBoxesListener()
    }
  }

  static getDerivedStateFromProps(props, state){
    return props
  }

  render () {
    return (
    	<Grid item xs={12} >
        {
          this.state.allBoxes.length > 0?
          <BoxSearch
              user={this.state.user}
              userMD={this.state.userMD}
              allBoxes={this.state.allBoxes}
              filteredBoxes={this.state.allBoxes}
              isOwner={false}
              isReadOnly={false}
              handleRemoveBox={this.props.handleRemoveBox}
          />
          :
          <Grid item xs={12}>
            <Paper elevation={2} align="center">
              <Typography variant="h3">
                No Gyms Found
              </Typography>
            </Paper>
          </Grid>
        }
  		</Grid>
    )
  }
}

export default BoxSearchPage = withTheme(BoxSearchPage);
