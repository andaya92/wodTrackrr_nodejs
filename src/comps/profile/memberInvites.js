// React
import React, { Component } from 'react'

// Material UI
import{
    Grid, Paper, Typography, IconButton, Tooltip
} from '@material-ui/core';
import { Check, Close } from '@material-ui/icons'

import ActionCancelModal from "../actionCancelModal"
import { withTheme } from '@material-ui/core/styles';
import { setClassMember, getUserMemberInvites, removeNotification } from "../../utils/firestore/classMember"

/*
	Given:
		userMD: props.userMD,
		boxID: props.boxID,
	Show:
		details of Box and its WODS, allows for removal of wods by owner
*/


function NotificationRaw(props){
  let senderUsername = props.info.senderUsername
  let gymClassTitle = props.info.gymClassTitle
  let gymClassBoxTitle = props.info.boxTitle

  return(
    <Grid container item xs={12}>
      <Grid item xs={8}>
        <Typography gutterBottom variant="subtitle1">
          {senderUsername} sent you an invite!
        </Typography>
        <Typography variant="subtitle2">
          Accept membership to {gymClassTitle} at {gymClassBoxTitle}?
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Tooltip title="Accept">
          <IconButton size="small" onClick={() => { props.acceptInvite(props.info) }} color="secondary">
            <Check />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item xs={2}>
        <Tooltip title="Decline">
          <IconButton size="small" onClick={() => { props.onRemoveNotification(props.info) }} >
            <Close color="error"/>
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  )
}
const Notification = withTheme(NotificationRaw)

class MemberInvites extends Component {
	constructor(props){
		super(props)
		this.state = {
      userMD: props.userMD,
      notifications: [],
      removeNotifyInfo: {},
      showRemoveNotify: false
		}
	}

	componentDidMount(){
    this.getListener()
	}

  componentWillUnmount(){
    if(this.notificationsListener)
        this.notificationsListener()
  }

	static getDerivedStateFromProps(props, state){
		return props
	}

  componentDidUpdate(){
    this.getListener()
  }

  getListener(){
    if(this.state.userMD.uid && !this.notificationsListener){
      this.notificationsListener = getUserMemberInvites(this.state.userMD.uid)
      .onSnapshot(ss => {
        let notifications = []
        if(!ss.empty){
          ss.docs.forEach(doc => {
            notifications.push(doc.data())
          })

          notifications.sort((a, b) => {
            return (a.date > b.date)? 1 : -1
          })

          this.setState({ notifications: notifications })
        }else{
          this.setState({ notifications: notifications })
        }
      },
      err => {
        console.log(err)
      })
    }
  }

  onRemoveNotification(notify){
    this.setState({
      removeNotifyInfo: notify,
      showRemoveNotify: true
    })
  }

  handleRemoveNotfiyModalClose(){
    this.setState({showRemoveNotify: false})
  }

  removeNotification(){
    removeNotification(this.state.removeNotifyInfo)
    .then( res => {
      console.log(res)
      this.handleRemoveNotfiyModalClose()
    })
    .catch( err => {
      console.log(err)
      this.handleRemoveNotfiyModalClose()
    })
  }



  acceptInvite(notify){
    const {
      boxID, gymClassID, gymClassTitle: classTitle, boxTitle, owner
    } = notify

    // TODO check for uid before sending.
    setClassMember(
        this.state.userMD.uid,
        boxID,
        gymClassID,
        owner,
        this.state.userMD.username,
        boxTitle,
        classTitle
    )
    .then(res => {
        removeNotification(notify)
        .then( res => { console.log(res) })
        .catch( err => { console.log(err) })
    })
    .catch(err => {
        console.log(err)
    })
  }

  render(){
		return(
      <Grid item xs={12} style={{margin: "16px 0px 0px 0px "}}>
      {this.state.notifications.length > 0?
        <Paper  elevation={6}>
          <Grid item xs={12}>
            <Typography gutterBottom
              variant="subtitle2"
              color="primary"
            >
              Member Notifications
            </Typography>
          </Grid>
          <Grid item xs={12}>
          {this.state.notifications.map((notify, i) => {
            return (
              <Notification key={i}
                info={notify}
                onRemoveNotification={this.onRemoveNotification.bind(this)}
                acceptInvite={this.acceptInvite.bind(this)}
              />)
          })}
          </Grid>
        </Paper>
      :
        <React.Fragment></React.Fragment>
      }
        <ActionCancelModal
          open={this.state.showRemoveNotify}
          onClose={this.handleRemoveNotfiyModalClose.bind(this)}
          onAction={this.removeNotification.bind(this)}
          modalText={ `Decline invitation to ${this.state.removeNotifyInfo.gymClassTitle}?`}
          actionText={"Decline"}
          cancelText={"Cancel"}
        />
      </Grid>
    )}
}

export default MemberInvites = withTheme(MemberInvites)