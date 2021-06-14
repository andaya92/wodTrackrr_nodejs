
import firebase from "../../context/firebaseContext"
import "firebase/storage"

let stor = firebase.storage();
const ROOT = "gymImages"

export default function mTea(){}


export function setImage(file, boxID, boxTitle){
  /* Uploads an image to the user's location

  /gymImages/boxID/boxTitle/image

  Overrides any previous image set.

  Args:
    file: A File object from user.
  Returns:
    message: A string to indicate success or failure.
   */
  let root = stor.ref(ROOT)
  let boxImage = root.child(boxID).child(boxTitle)
  console.log("file, boxID, boxTitle")
  console.log(file, boxID, boxTitle)
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



export function getImage(boxID, boxTitle){
  let root = stor.ref(ROOT)
  let boxImage = root.child(boxID).child(boxTitle)
  boxImage.getDownloadURL()
  .then((res) => {
    console.log(res)
  })
  .catch(err => {
    console.log(err)
  })
}


const DEFAULT_IMAGE_URL = "https://cdn.shopify.com/s/files/1/2416/1345/files/NCFIT_Logo_Shop_3x_5224365a-50f5-4079-b7cc-0f7ebeb4f470.png?height=628&pad_color=ffffff&v=1595625119&width=1200"
export function getImages(fileNames){
  let root = stor.ref(ROOT)
  let promises = []

  fileNames.forEach(file => {
    promises.push(new Promise((res, rej) => {
      const [ boxID, boxTitle ] = file
      console.log(`Getting image for ${boxID}/${boxTitle}`)
      let boxImage = root.child(boxID).child(boxTitle)
      boxImage.getDownloadURL()
      .then(url => {
          res([`${boxID}/${boxTitle}`, url])
      })
      .catch(err => {
        res([`${boxID}/${boxTitle}`, DEFAULT_IMAGE_URL])
      })
    }))
  })

  return Promise.all(promises)
}




export function deleteImage(boxID, boxTitle){
  // Remove node gymImages/boxID/boxTitle
}

export function deleteGymImages(boxID){
  // Remove node gymImages/boxID
}




/**
 * Delete image when box is deleted.
 *
 * Update FireStore::Boxes::deleteBox
 *
 *
 *
 */