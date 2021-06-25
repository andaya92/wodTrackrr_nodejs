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
    stor.ref(ROOT).child(boxID).child(classID).delete()
    .then(() => {
      res("Deleted classImage")
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