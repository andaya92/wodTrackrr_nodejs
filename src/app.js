import firebase, { FirebaseAuthContext } from "./context/firebaseContext"
import "firebase/auth"
import "firebase/firestore"

import React from "react";
import { HashRouter, Switch, Route, Link, Redirect, Router, BrowserRouter } from 'react-router-dom';

import { Paper, Button, BottomNavigation, BottomNavigationAction,
        Grid, Container, Box }
from '@material-ui/core';
import { createMuiTheme, withStyles, ThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';

import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import PanoramaIcon from '@material-ui/icons/Panorama';

import "./styles.css";


import BoxSearchPage from "./pages/boxSearchPage"
import Settings from "./pages/settings"
import BoxView from "./comps/boxes/boxView"
import RegisterUser from "./comps/profile/registerUser"
import GymClassView from "./comps/gymClasses/gymClassView"
import ScoreView from "./comps/scores/scoreView"
import Profile from "./pages/profile"
import Header from "./comps/header"
import Login from "./comps/profile/login"


import apptheme from "./css/apptheme"
import lightapptheme from "./css/applighttheme"
import "./styles.css"

let darkTheme = createMuiTheme(apptheme)
darkTheme = responsiveFontSizes(darkTheme)


let lightTheme = createMuiTheme(lightapptheme)
lightTheme = responsiveFontSizes(lightTheme)

const BackgroundGrid = withStyles(theme =>({
  root:{
    backgroundColor: theme.palette.background.paper
  }
}))(Grid)


export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      btmnav: 0,
      user: firebase.auth().currentUser,
      userMD: false,
      theme: darkTheme,
      darkTheme: true,
      alertOpen: false,
      alertInfo: false
    }
  }

  static getDerivedStateFromProps(props, state){
    return state
  }


  componentDidMount(){
    this.firebaseAuthListener = firebase.auth()
    .onAuthStateChanged(user => {
      let fs = firebase.firestore()
      if(user){
        let doc = fs.collection("users").doc(user.uid)
        this.userMDListener = doc.onSnapshot(metadata => {
          if(metadata.exists){
            this.setState({ user: user, userMD: metadata.data() })
          }else{
            this.setState({ user: user, userMD: false })
          }
        }, err => {console.log(err)})

      }else{
        this.setState({ user: null, userMD: false })
      }
    })

  }

  handleLogin(user){
    this.setState({user: user})
  }

  handleLogout(){
    firebase.auth().signOut().then(() => {
      this.setState({user: null})
    }, (error) => {
      console.error('Sign Out Error', error )
    });
  }

  componentWillUnmount(){
    if(this.firebaseAuthListener !== undefined)
      this.firebaseAuthListener && this.firebaseAuthListener()
    if(this.userMDListener !== null)
      this.userMDListener && this.userMDListener()
  }

  changeTheme(){
    let newTheme  = this.state.darkTheme? lightTheme: darkTheme
    this.setState({theme: newTheme, darkTheme: !this.state.darkTheme})
  }

  onAlert(alert){
    console.log(alert)
    this.setState({alertInfo: alert, alertOpen: true})
  }

  onCloseAlert(){
    this.setState({alertOpen: false, alertInfo: false})
  }



  render(){
    return(
    <FirebaseAuthContext.Provider>
    <BrowserRouter >
    <ThemeProvider theme={this.state.theme}>
    <Header className="header" user={this.state.user}
      userMD={this.state.userMD}
      changeTheme={this.changeTheme.bind(this)}
      handleLogout={this.handleLogout.bind(this)}
      alertOpen={this.state.alertOpen}
      alertInfo={this.state.alertInfo}
      onCloseAlert={this.onCloseAlert.bind(this)}
      />

      <BackgroundGrid container id="testCont">
        <Grid item container xs={12}
          style={{"minHeight": "100vh", paddingTop: "8px"}}>
          <Switch>
            <Route exact path="/boxSearch">
              <BoxSearchPage user={this.state.user}
                userMD={this.state.userMD}
                onAlert={this.onAlert.bind(this)}
                />
            </Route>
            <Route exact path="/profile">
              {this.state.user?
                <Profile user={this.state.user}
                  userMD={this.state.userMD}
                  onAlert={this.onAlert.bind(this)}
                  />
              :
                <Redirect to="/login" />
              }
            </Route>

            <Route path="/box/:boxID"
              render= { props =>(
                <BoxView
                  userMD={this.state.userMD}
                  boxID={props.match.params.boxID}
                  onAlert={this.onAlert.bind(this)}/>
              )}
            />
            <Route path="/class/:boxID/:gymClassID"
              render= { props =>(
                <GymClassView
                  userMD={this.state.userMD}
                  gymClassID={props.match.params.gymClassID}
                  boxID={props.match.params.boxID}
                  onAlert={this.onAlert.bind(this)}/>
              )}
            />
           <Route path="/wod/:boxID/:gymClassID/:wodID"
            render= { props =>(
                <ScoreView userMD={this.state.userMD}
                  gymClassID={props.match.params.gymClassID}
                  wodID={props.match.params.wodID}
                  boxID={props.match.params.boxID}
                  isReadOnly={true}
                  onAlert={this.onAlert.bind(this)}/>
              )
            }
          />
          <Route exact path="/register"
            render= { props =>(
              this.state.user?
                <Redirect to="/profile" />
              :
                <RegisterUser onAlert={this.onAlert.bind(this)}/>
              )
            }
          />

          <Route exact path="/settings"
            render= { props =>(
                <Settings
                  user={this.state.user}
                  userMD={this.state.userMD}
                  onAlert={this.onAlert.bind(this)}
                />
            )}
          />

          <Route exact path="/login">
            {!this.state.user?
              <Login
                onLogin={this.handleLogin.bind(this)}
                onAlert={this.onAlert.bind(this)}/>
            :
              <Redirect to="/boxSearch" />
            }
            </Route>
          </Switch>
          <div style={{"margin": "5vh"}}></div>
        </Grid>
      </BackgroundGrid>

      <BottomNavigation className="footer"
        value = {this.state.btmnav}
        onChange = {(event, newValue) => {
            this.setState({btmnav: newValue})
          }}
          style={{background: this.state.theme.palette.primary.mainGrad}}
        showLabels
      >
        <BottomNavigationAction label="Search" component={Link} to="/boxSearch" icon={<PersonIcon />}  />
        <BottomNavigationAction label="Profile" component={Link} to="/profile" icon={<PersonIcon />}  />
      </BottomNavigation>
      </ThemeProvider>
      </BrowserRouter>
      </FirebaseAuthContext.Provider>

    );
  }
}
App.contextType = FirebaseAuthContext;

