import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/firestore";

let fs = firebase.firestore();
const ROOT = "boxes"
export default function mTea(){}

export function updateBoxLocation(boxID, location, uid){
  return new Promise((res, rej) => {
    fs.collection(ROOT).doc(boxID)
    .update({
      location: location
    })
    .then(() => {
      res(`Updated location of ${boxID} to ${location}`)
    })
    .catch(err => {
      rej(err.message)
    })
  })
}


