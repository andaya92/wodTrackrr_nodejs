
import firebase from "../../context/firebaseContext"
import "firebase/storage"
import { makeCancelable } from "../promises"

let stor = firebase.storage();
const ROOT = "gymImages"

export default function mTea(){}


export function setImage(file, boxID){
  /* Uploads an image to the user's location

  /gymImages/boxID/boxTitle/image

  Overrides any previous image set.

  Args:
    file: A File object from user.
  Returns:
    message: A string to indicate success or failure.
   */
  let root = stor.ref(ROOT)
  let boxImage = root.child(boxID)
  return new Promise((res, rej) => {
    boxImage.put(file).then( ss => {
      console.log(ss)
      res("Uploaded file.")
    })
    .catch(err => {
      console.log(err)
      rej("Failed to upload file.")
    })
  })
}



export function getImage(boxID){
  let root = stor.ref(ROOT)
  let boxImage = root.child(boxID)
  return new Promise((res, rej) => {
    boxImage.getDownloadURL()
    .then((url) => {
      res(url)
    })
    .catch(err => {
      rej(err)
    })
  })
}


const DEFAULT_IMAGE_URL = "https://cdn.shopify.com/s/files/1/2416/1345/files/NCFIT_Logo_Shop_3x_5224365a-50f5-4079-b7cc-0f7ebeb4f470.png?height=628&pad_color=ffffff&v=1595625119&width=1200"
export function getImages(boxIDs){
  let root = stor.ref(ROOT)
  let promises = []

  boxIDs.forEach(boxID => {
    promises.push(new Promise((res, rej) => {
      console.log(`Getting image for ${boxID}`)
      let boxImage = root.child(boxID)
      boxImage.getDownloadURL()
      .then(url => {
          res([boxID, url])
      })
      .catch(err => {
        res([boxID, DEFAULT_IMAGE_URL])
      })
    }))
  })

  return makeCancelable(Promise.all(promises))
}

export function deleteGymImage(boxID){
  return new Promise((res, rej) => {
    stor.ref(ROOT).child(boxID).delete()
    .then(() => {
      res("Deleted boxImages")
    })
    .catch(err => {
      if(err.code === "storage/object-not-found"){
        res("No Image to delete.")
        return
      }
      rej(err.message)
    })
  })
}


/**
 * Delete image when box is deleted.
 *
 * Update FireStore::Boxes::deleteBox
 *
 *
 *
 */