import React, { Component } from 'react'
import { withRouter } from "react-router-dom"

import{
  Grid, Typography, IconButton, TextField, InputAdornment,
  TableBody, Table, TableCell, TableContainer, TableHead, TableRow, Tooltip
}from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import PhotoIcon from '@material-ui/icons/Photo';
import Delete from '@material-ui/icons/Delete'

import ActionCancelModal from "../actionCancelModal"
import { getGymClasses, removeGymClass } from '../../utils/firestore/gymClass'
import { getClassImages } from '../../utils/firestore/classImages'

const DEFAULT_IMAGE_URL = "https://cdn.shopify.com/s/files/1/2416/1345/files/NCFIT_Logo_Shop_3x_5224365a-50f5-4079-b7cc-0f7ebeb4f470.png?height=628&pad_color=ffffff&v=1595625119&width=1200"
function GymClassRaw(props){
  let title = props.info["title"]
  let boxID = props.info["boxID"]
  let gymClassID = props.info["gymClassID"]

  return(
    <TableRow hover
      id={`class/${gymClassID}`} name="GymClassRow"
      onClick={(ev) => {props.onRowClick(ev, `/class/${boxID}/${gymClassID}`)} }
    >
      <TableCell align="left">
        <Typography variant="subtitle1" color="primary">
          { title }
        </Typography>
        <img alt="classImage"
         src={props.image}
         style={{width: "100%"}}
        />
      </TableCell>
      <TableCell align="right">
        { props.isOwner ?
          <React.Fragment>
            <Tooltip title="Delete Class">
              <IconButton
                onClick={()=>{props.onRemove(props.info)}}>
                <Delete  color="error" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Upload Image">
            <IconButton
              onClick={()=>{ props.showUploadClassImage(gymClassID) }}>
                <PhotoIcon color="primary"/>
            </IconButton>
          </Tooltip>
        </React.Fragment>
        :
          <React.Fragment></React.Fragment>
        }
      </TableCell>
    </TableRow>
  )
}

const GymClass = withTheme(GymClassRaw)

function EmptyClassRaw(props){
  return(
    <TableRow>
      <TableCell colSpan={3} align="center">
        <Typography variant="subtitle1" color="primary">
          No Classes!
        </Typography>
      </TableCell>
    </TableRow>
  )
}

const EmptyClass = withTheme(EmptyClassRaw)

class GymClassList extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      isOwner: props.isOwner,
      boxID: props.boxID,
      filteredGymClasses:[],
      gymClasses: [],
      removeClass: {},
      openModal: false,
      urls: {}
    }
  }

  componentDidMount(){
    this.getGymClasses(this.state.boxID)
  }

  _getClassImages(classes){
    let classIDs = classes.map(gymClass => gymClass.gymClassID)

    getClassImages(this.state.boxID, classIDs)
    .then(urls => {
      console.log(Object.fromEntries(urls))
      this.setState({
        urls: Object.fromEntries(urls)
      })
    })
    .catch(err => console.log(err))
  }

  getGymClasses(boxID){
    if(boxID && ! this.gymClassListener){
      this.gymClassListener = getGymClasses(this.state.boxID)
      .onSnapshot(ss => {
        console.log(ss)
        if(!ss.empty){
          let classes = []
          ss.forEach(doc => {
            classes.push(doc.data())
          })

          // get images
          this._getClassImages(classes)
          this.setState({gymClasses: classes, filteredGymClasses: classes})
        }else{
          this.setState({gymClasses: [], filteredGymClasses: []})
        }
      },
      err => {console.log(err)})
    }
  }

  static getDerivedStateFromProps(props, state){
    return props
  }

  componentDidUpdate(){
    this.getGymClasses(this.state.boxID)
  }

  componentWillUnmount(){
    if(this.gymClassListener){
      this.gymClassListener()
    }
  }

  onKeyUp(data){
    if((data.keyCode || data.which) === 13){
    }
  }

  onChange(ev){
    let val = ev.target.value
    let filteredGymClasses = this.state.gymClasses.filter(gymClass =>{
      return gymClass["title"].toLowerCase().includes(val.toLowerCase())
    })
    this.setState({filteredGymClasses: filteredGymClasses})
  }

  onRowClick(ev, id){
    let tagName = ev.target.tagName
    if(["span", "svg", "path"].indexOf(tagName) < 0){
      this.props.history.push(id)
    }
  }

  handleRemoveGymClass(){
    if(!this.state.boxID && !this.state.removeClass.gymClassID){
      this.props.onAlert({type: "error", message: "Class info missing!"})
      return
    }
    removeGymClass(this.state.removeClass)
    .then((res) => {
      this.closeModal()
      this.props.onAlert({
        type: "success",
        message: "Deleted class!"
      })
    })
    .catch(err => {
      console.log(err)
      this.closeModal()
    })
  }

  onRemove(gymClass){
    this.setState({openModal: true, removeClass: gymClass})
  }

  closeModal(){
    this.setState({openModal: false})
  }

  render () {
    return (
      <Grid item xs={12}>
        <Grid item xs={12}>
          <Grid item xs={12} style={{margin: "0px 0px 8px 0px"}}>
            <TextField
              placeholder="Search Classes"
              variant="outlined"
              onKeyUp={this.onKeyUp.bind(this)}
              onChange={this.onChange.bind(this)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment >
                    <SearchIcon color="primary" />
                  </InputAdornment>
                )
              }}
            />
            <TableContainer style={{
              minHeight: "50vh",
              maxHeight: "50vh"
            }}>
              <Table>

                <TableBody>
                {this.state.filteredGymClasses.length > 0?
                  this.state.filteredGymClasses.map((gymClass, i) => {
                    let image = this.state.urls[gymClass.gymClassID] ?
                      this.state.urls[gymClass.gymClassID] : DEFAULT_IMAGE_URL
                    return <GymClass
                            key={i}
                            info={gymClass}
                            onRemove={this.onRemove.bind(this)}
                            isOwner={this.props.isOwner}
                            showUploadClassImage={this.props.showUploadClassImage}
                            onRowClick={this.onRowClick.bind(this)}
                            image={image}
                            />
                  })
                :
                  <EmptyClass />
                }

                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <ActionCancelModal
          open={this.state.openModal}
          actionText="Remove"
          cancelText="Cancel"
          modalText={`Remove Class (${this.state.removeClass.title})?`}
          onAction={this.handleRemoveGymClass.bind(this)}
          onClose={this.closeModal.bind(this)}
        />
      </Grid>
    )
  }
}

export default GymClassList = withRouter(withTheme(GymClassList))
