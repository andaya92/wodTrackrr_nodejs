import firebase, { FirebaseAuthContext } from "./context/firebaseContext"
import "firebase/auth"
import "firebase/firestore"

import React from "react";
import {
  Switch, Route, Link, BrowserRouter
} from 'react-router-dom';

import {
  BottomNavigation, BottomNavigationAction,Grid, Paper
} from '@material-ui/core';

import {
  createMuiTheme, withStyles, ThemeProvider, responsiveFontSizes
} from '@material-ui/core/styles';

import PersonIcon from '@material-ui/icons/Person';

import "./styles.css";
import HomePage from "./pages/homePage"
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


const breakPoints = ['xs', 'sm', 'md', 'lg', 'xl']
let darkTheme = createMuiTheme(apptheme)
let lightTheme = createMuiTheme(lightapptheme)
darkTheme = responsiveFontSizes(darkTheme, breakPoints)
lightTheme = responsiveFontSizes(lightTheme, breakPoints)

const BackgroundGrid = withStyles(theme =>({
  root:{
    backgroundColor: theme.palette.background.paper,
    position: "absolute",
    maxHeight: "calc(100vh - 199%)",
    minHeight: "calc(100vh - 199%)",
    overflowY: "scroll"
  }
}))(Grid)

const StyledBottomNavigation = withStyles(theme =>({
  root:{
    minHeight: "64px",
    maxHeight: "64px",
    top: "calc(100vh - 64px)",
    width: "100%",
    position: "fixed",
    background: theme.palette.primary.mainGrad
  }
}))(BottomNavigation)

const StyledHeader = withStyles(theme =>({
  root:{
    minHeight: "64px",
    maxHeight: "64px"
  }
}))(Header)


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
      alertInfo: false,
      loading: true
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
          // console.log("USer MD change")
          if(metadata.exists){
            // console.log(metadata.data())
            this.setState({ user: user, userMD: metadata.data() })
          }else{
            this.setState({ user: user, userMD: false })
          }
          this.setState({loading: false})
        }, err => {console.log(err)})
      }else{
        this.setState({ user: null, userMD: false })
        this.setState({loading: false})
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
    console.log(alert) // TDOO() remove
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
    <StyledHeader className="header" user={this.state.user}
      userMD={this.state.userMD}
      changeTheme={this.changeTheme.bind(this)}
      handleLogout={this.handleLogout.bind(this)}
      alertOpen={this.state.alertOpen}
      alertInfo={this.state.alertInfo}
      onCloseAlert={this.onCloseAlert.bind(this)}
    />

    <BackgroundGrid container direction="column" alignItems="center">
      <Grid item container xs={12} sm={11} md={10} lg={9} xl={8}
        style={{
          minHeight: "100%",
          paddingTop: "8px",
          paddingLeft: "8px",
          paddingRight: "8px"
        }}
      >
        <Paper style={{width: "100%"}}>
          <React.Fragment>
            {this.state.loading?
              <h1>Loading</h1>
            :
            <Switch>
              <Route exact path="/">
                <HomePage
                  onAlert={this.onAlert.bind(this)}
                  />
              </Route>

              <Route exact path="/boxSearch">
                <BoxSearchPage user={this.state.user}
                  userMD={this.state.userMD}
                  onAlert={this.onAlert.bind(this)}
                  />
              </Route>

              <Route exact path="/profile">
                <Profile user={this.state.user}
                  userMD={this.state.userMD}
                  onAlert={this.onAlert.bind(this)}
                  />
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
                  <RegisterUser onAlert={this.onAlert.bind(this)}/>
                )}
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
                <Login
                  userMD={this.state.userMD}
                  onLogin={this.handleLogin.bind(this)}
                  onAlert={this.onAlert.bind(this)}/>
              </Route>
            </Switch>
            }
          </React.Fragment>
        </Paper>
      </Grid>
    </BackgroundGrid>

    <StyledBottomNavigation
      value = {this.state.btmnav}
      onChange = {(event, newValue) => {
          this.setState({btmnav: newValue})
        }}
      showLabels
    >
      <BottomNavigationAction label="Search" component={Link} to="/boxSearch" icon={<PersonIcon />}  />
      <BottomNavigationAction label="Profile" component={Link} to="/profile" icon={<PersonIcon />}  />
    </StyledBottomNavigation>
    </ThemeProvider>
    </BrowserRouter>
    </FirebaseAuthContext.Provider>
    )
  }
}
App.contextType = FirebaseAuthContext;


