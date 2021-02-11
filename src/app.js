import firebase, { FirebaseAuthContext } from "./context/firebaseContext"
import "firebase/auth";
import "firebase/storage"; 
import "firebase/database";
import "firebase/firestore";


import React from "react";
import { HashRouter, Switch, Route, Link } from 'react-router-dom';


import { Paper, Button, BottomNavigation, BottomNavigationAction ,Grid, Container} from '@material-ui/core';


import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import PanoramaIcon from '@material-ui/icons/Panorama';

import "./styles.css";


import BoxSearchPage from "./pages/boxSearchPage"
import BoxView from "./comps/boxes/boxView"
import RegisterUser from "./comps/profile/registerUser"
import ScoreView from "./comps/scores/scoreView"
import Profile from "./pages/profile"
import Header from "./comps/header"


import history from "./history"

import { createMuiTheme, ThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import lightBlue from '@material-ui/core/colors/lightBlue';
import pink from '@material-ui/core/colors/pink';
import teal from '@material-ui/core/colors/teal';

import apptheme from "./css/apptheme"

// Needs to move to its own file
let theme = createMuiTheme(apptheme);
theme = responsiveFontSizes(theme)



export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      btmnav: 0,
      user: firebase.auth().currentUser,
      userMD: false
    }

  }

  componentWillMount(){
    this.firebaseAuthListener = firebase.auth()
    .onAuthStateChanged(user => {
      let fs = firebase.firestore();
      let metadata = false
      if(user){
        let doc = fs.collection("users").doc(user.uid)
        this.userMDListener = doc.onSnapshot(metadata => {
          if(metadata.exists){
            this.setState({ user: user, userMD: metadata.data() })
          }else{
            this.setState({ user: user, userMD: false })
          }
        }, err => {console.log(err)})

      }
    })

  }

  componentWillUnmount(){
    if(this.firebaseAuthListener !== undefined)
      this.firebaseAuthListener && this.firebaseAuthListener()
    if(this.userMDListener !== null)
      this.userMDListener && this.userMDListener()
  }

  render(){
    return(
    <FirebaseAuthContext.Provider>
    <HashRouter history={history} >
    <ThemeProvider theme={theme}>
      <Grid container>
        <Grid item xs={12} id="page-header">
          <Header className="header" />
        </Grid>
        <Grid item xs={11} id="page-container" className="page-content">
          <Switch>
            <Route exact path="/boxSearch">
              <BoxSearchPage user={this.state.user}
                userMD={this.state.userMD} />
            </Route>     
            <Route exact path="/profile">
              <Profile user={this.state.user}
                userMD={this.state.userMD} />
            </Route>
            <Route path="/box/:boxID"
              render= { props =>(
                <BoxView
                  userMD={this.state.userMD}
                  boxID={props.match.params.boxID}/>
                )
              } 
            />
           <Route path="/wod/:boxID/:wodID"
            render= { props =>(
              <ScoreView userMD={this.state.userMD}
                boxID={props.match.params.boxID}
                wodID={props.match.params.wodID}
                isReadOnly={true}/>
              )
            } 
          />
          <Route exact path="/register"
            render= { props =>(
              <RegisterUser />
              )
            } 
          />
          </Switch>
          <div style={{"margin": "10vh"}}></div>
        </Grid>
        <Grid item xs={12} className="footer">
          <BottomNavigation 
            value = {this.state.btmnav}
            onChange = {(event, newValue) => {
                this.setState({btmnav: newValue})
              }}
              style={{background: theme.palette.background.toolbar}}
            showLabels
          >
            <BottomNavigationAction label="Search" component={Link} to="/boxSearch" icon={<PersonIcon />}  />
            <BottomNavigationAction label="Profile" component={Link} to="/profile" icon={<PersonIcon />}  />
          </BottomNavigation>
        </Grid>
      </Grid>
      </ThemeProvider>
      </HashRouter>
      </FirebaseAuthContext.Provider>
  
    );
  }
}
App.contextType = FirebaseAuthContext;

