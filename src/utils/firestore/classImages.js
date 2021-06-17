
import firebase from "../../context/firebaseContext"
import "firebase/storage"

let stor = firebase.storage();
const ROOT = "classImages"

export default function mTea(){}


export function setClassImage(file, boxID, classID){
  /* Uploads an image to the user's location

  /gymImages/boxID/boxTitle/image

  Overrides any previous image set.

  Args:
    file: A File object from user.
  Returns:
    message: A string to indicate success or failure.
   */
  let root = stor.ref(ROOT)
  let classImage = root.child(boxID).child(classID)
  return new Promise((res, rej) => {
    classImage.put(file).then( ss => {
      console.log(ss)
      res("Uploaded class image.")
    })
    .catch(err => {
      console.log(err)
      rej("Failed to upload class image.")
    })
  })
}



export function getClassImage(boxID, classID){
  let root = stor.ref(ROOT)
  let classImage = root.child(boxID).child(classID)
  return new Promise((res, rej) => {
    classImage.getDownloadURL()
    .then((url) => {
      res(url)
    })
    .catch(err => {
      rej(err)
    })
  })
}


const DEFAULT_IMAGE_URL = "https://cdn.shopify.com/s/files/1/2416/1345/files/NCFIT_Logo_Shop_3x_5224365a-50f5-4079-b7cc-0f7ebeb4f470.png?height=628&pad_color=ffffff&v=1595625119&width=1200"
export function getClassImages(boxID, classIDs){
  let root = stor.ref(ROOT)
  let promises = []

  let classImages = root.child(boxID)
  return new Promise((resolve, reject) => {
    classImages.listAll()
    .then(list => {
      list.items.forEach( classImage => {
        console.log(classImage)
        promises.push(new Promise((res, rej) => {
          let classID = classImage.name
          classImage.getDownloadURL()
          .then(url => {
            res([classID, url])
          })
        }))
      })
      resolve(Promise.all(promises))
    })
  })
}

export function deleteClassImage(boxID, classID){
  return new Promise((res, rej) => {
    let boxImages = stor.ref(ROOT).child(boxID).child(classID).delete()
    .then(() => {
      res("Deleted classImage")
    })
    .catch(err => {
      if(err.code == 404){
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