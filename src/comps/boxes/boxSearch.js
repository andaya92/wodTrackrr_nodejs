import React, { Component } from 'react'

import{
  Grid, Paper, Typography, IconButton, TextField, InputAdornment,
  Card, CardMedia, CardActionArea, CardContent, CardActions, Tooltip
}from '@material-ui/core'
import { withRouter } from "react-router-dom";

import SearchIcon from '@material-ui/icons/Search'
import PhotoIcon from '@material-ui/icons/Photo';
import { withTheme, withStyles } from '@material-ui/core/styles'

import Delete from '@material-ui/icons/Delete'
import Whatshot from '@material-ui/icons/Whatshot'

import UploadImageModal from "./uploadImageModal"
import { setFollow, removeFollow, getUserFollowers, getFollowsFromSS } from "../../utils/firestore/follows"
import { toDayYear } from "../../utils/formatting"
import { setImage, getImages, deleteGymImage} from "../../utils/firestore/gymImages"



const DEFAULT_IMAGE_URL = "https://cdn.shopify.com/s/files/1/2416/1345/files/NCFIT_Logo_Shop_3x_5224365a-50f5-4079-b7cc-0f7ebeb4f470.png?height=628&pad_color=ffffff&v=1595625119&width=1200"

const StyledCardMedia = withStyles(theme =>({
  root:{
    width: "50%",
    margin: "0 auto",
    borderRadius: "8px"
  }
}))(CardMedia)




function BoxRaw(props){
  let title = props.info["title"]
  let boxID = props.info["boxID"]
  let description = props.info["description"]

  return(
    <Card id={`box/${boxID}`} onClick={(ev) => props.onRowClick(ev, `box/${boxID}`)}>
      <CardActionArea>
        <StyledCardMedia component="img"
          image={props.boxImage}
          title="NC Fit"
        />
        <CardContent>
          <Grid item align='left' xs={12}>
            <Typography gutterBottom variant="h5" component="h2">
              { title }
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              { description }
            </Typography>
            <Typography variant="caption" color="textSecondary" component="p">
              { toDayYear(new Date(props.info['date'])) }
            </Typography>
          </Grid>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <React.Fragment>
          { props.isUserFollowing ?
              <Tooltip title="Unfollow">
                <IconButton variant="outlined" style={{ marginLeft: 'auto'}}
                    onClick={()=>{props.handleUnfollow(boxID)}}>
                  <Whatshot color="primary" />
                </IconButton>
              </Tooltip>
            :
            <Tooltip title="Follow">
                <IconButton style={{ marginLeft: 'auto'}}
                  onClick={()=>{props.handleFollow(props.info)}}>
                  <Whatshot style={{fill: props.theme.palette.text.primary}}/>
                </IconButton>
            </Tooltip>
          }
          { props.isOwner ?
          <React.Fragment>
            <Tooltip title="Delete Gym">
              <IconButton
                onClick={()=>{props.handleRemoveBox(boxID, title)}}>
                <Delete  color="error" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Upload Image">
              <IconButton
                onClick={()=>{ props.showUploadImage(boxID) }}>
                  <PhotoIcon color="primary"/>
              </IconButton>

            </Tooltip>
          </React.Fragment>

          :
            <React.Fragment></React.Fragment>
          }
          <Tooltip title="Delete GymImages">
              <IconButton
                onClick={()=>{ deleteGymImage(boxID) }}>
                <Delete  color="primary" />
              </IconButton>
          </Tooltip>
        </React.Fragment>
      </CardActions>
    </Card>
  )

}
const Box = withTheme(BoxRaw)


function EmptyBoxRaw(props){
  return(
    <Grid item align="center" xs={12}>
      <Typography variant="subtitle1" color="primary">
        No Gyms!
      </Typography>
    </Grid>
  )
}
const EmptyBox = withTheme(EmptyBoxRaw)

class BoxSearch extends Component {
  constructor(props){
    super(props)
    this.state = {
      userMD: props.userMD,
      isOwner: props.isOwner,
      allBoxes: props.allBoxes,
      filteredBoxes: props.filteredBoxes,
      userFollowing: {},
      showingUploadImage: false,
      curUploadBoxID: "",
      boxImages: {}

  }
}

  componentDidMount(){
    this.listenForFollowing()
    this._getImages()
  }

  componentWillUnmount(){
    if(this.followListener){
      this.followListener()
    }
    if(this.getGymImageFetcher){
      this.getGymImageFetcher.cancel()
    }
  }

  static getDerivedStateFromProps(props, state){
    return state.userMD? state: props
  }

  componentDidUpdate(){
    this.listenForFollowing()
  }



  listenForFollowing(){
    if(this.state.userMD && !this.followListener){
      this.followListener = getUserFollowers(this.state.userMD.uid)
      .onSnapshot( ss => {
        let boxIDs = getFollowsFromSS(ss)
        let following = {}
        boxIDs.forEach(id =>{
          following[id] = true
        })
        this.setState({userFollowing: following})
      },
      err => { console.log(err) })
    }
  }

  onChange(ev){
    let val = ev.target.value
    let filteredBoxes = this.state.allBoxes.filter(box =>{
      return box["title"].toLowerCase().includes(val.toLowerCase())
    })
    console.log("filteredBoxes")
    console.log(filteredBoxes)
    this.setState({filteredBoxes: filteredBoxes})
  }

  onKeyUp(data){
    if((data.keyCode || data.which) === 13){
    }
  }

  isUserFollowing(boxID){
    return (this.state.userFollowing[boxID])? true: false
  }

  handleFollow(boxInfo){
    setFollow(this.state.userMD.uid, this.state.userMD.username, boxInfo.boxID,
              boxInfo.title, boxInfo.uid)
    .then(res => {console.log("Succefully followed.")})
    .catch(err => {console.log(err)})
  }

  handleUnfollow(boxID){

    removeFollow(this.state.userMD.uid, boxID)
    .then(res => {
      if(res){
        console.log("Succefully unfollowed.")
      }
    })
    .catch(err => {console.log(err)})
  }

  onRowClick(ev, id){
    let tagName = ev.target.tagName
    if(["span", "svg", "path", "BUTTON", "SPAN"].indexOf(tagName) < 0){
      this.props.history.push(id);
    }
  }

  showUploadImage(boxID){
    /* Show upload image modal and set state for the box that called.
     */
    this.setState({
      showingUploadImage: true,
      curUploadBoxID: boxID,

    })
  }

  hideUploadImage(){
    this.setState({showingUploadImage: false})
  }

  uploadImage(file){

    if(!file || !this.state.curUploadBoxID){
      console.log("Failed to begin upload.")
      console.log(file, this.state.curUploadBoxID)
    }


    setImage(file, this.state.curUploadBoxID)
    .then((msg) => {
      this.hideUploadImage()
      this.props.onAlert({
        type: 'success',
        message: msg
      })
    })
    .catch(msg => {
      this.hideUploadImage()
      this.props.onAlert({
        type: 'error',
        message: msg
      })
    })
  }


  _getImages(){
    let boxIDs = this.state.allBoxes.map(box => {
      return box.boxID
    })

    this.getGymImageFetcher = getImages(boxIDs)
    this.getGymImageFetcher.promise.then(urls => {
      this.setState({ boxImages: Object.fromEntries(urls) })
    })
    .catch(err => {
      console.log(err)
    })

  }

  render () {
    return (
      <Grid item xs={12} style={{marginTop: "3vh"}}>
        <Grid item xs={12} style={{margin: "0px 0px 8px 0px"}}>
        <Paper elevation={2} component="form">
            {/* <Button onClick={testBoxes}>Test Boxes Generate 1000</Button> */}
           <TextField
             fullWidth
              variant="outlined"
              onKeyUp={this.onKeyUp.bind(this)}
              onChange={this.onChange.bind(this)}
              placeholder="Search Boxes"
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <SearchIcon color="primary" />
                  </InputAdornment>
                )
              }}
          />
        </Paper>
        </Grid>
        <Grid item xs={12}>

    { this.state.filteredBoxes.length > 0?
      this.state.filteredBoxes.map((box, i) => {
        let url = this.state.boxImages[box.boxID]
        url = url? url: DEFAULT_IMAGE_URL
        return <Box
                key={i}
                theme={this.props.theme}
                info={box}
                boxImage={url}
                color={this.props.theme.palette.primary.mainGrad}
                handleBoxView={this.props.handleBoxView}
                handleRemoveBox={this.props.handleRemoveBox}
                isOwner={this.props.isOwner}
                isUserFollowing={this.isUserFollowing(box["boxID"])}
                handleFollow={this.handleFollow.bind(this)}
                handleUnfollow={this.handleUnfollow.bind(this)}
                onRowClick={this.onRowClick.bind(this)}
                showUploadImage={this.showUploadImage.bind(this)}
                />
      })
    :
      <EmptyBox />
    }
        </Grid>
        <UploadImageModal
          open={this.state.showingUploadImage}
          actionText="Upload Image"
          cancelText="Cancel"
          modalText="Select an image to upload"
          onAction={this.uploadImage.bind(this)}
          onClose={this.hideUploadImage.bind(this)}
        />
      </Grid>
    );
  }
}



export default BoxSearch = withRouter(withTheme(BoxSearch))
