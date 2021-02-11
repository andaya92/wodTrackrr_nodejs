import firebase from "../context/firebaseContext"
import "firebase/auth"; 
import "firebase/storage";
import "firebase/database";
var storage = firebase.storage()
var db = firebase.database();





export default function mTea(){}

/*
	Boxes
*/

export function setBox(title, uid){
  	let boxNamesTitle = `boxNames/${title}`
  	let userBoxes = `users/${uid}/boxes`
  	let boxes = `boxes`

  	return new Promise((res, rej) => {
  		db.ref(boxNamesTitle).once("value", ss =>{
			if(ss.exists()){
				rej("Title exists")
			}else{
				let boxID = db.ref(boxes).push().key
				let boxData = {
					title: title,
					ownerUID: uid,
					boxID: boxID,
					date: Date.now()
				}

				Promise.all([
					// add to list of all boxes
					db.ref(`${boxes}/${boxID}`).set(boxData),
					// add to list of boxNames
					db.ref(boxNamesTitle).set(boxData),
					// add to users list of boxes
					db.ref(`${userBoxes}/${boxID}`).set(boxData)
				])
				.then((values) => {
					res(`Succefully created box ${values.toString()}`)
				})
			}
		})
  	})
 }

 export function removeBox(boxID, title, uid){

  	let boxNamesTitle = `boxNames/${title}`
  	let userBoxes = `users/${uid}/boxes/${boxID}`
  	let boxes = `boxes/${boxID}`
  	let wods = `wods/${boxID}`
  	return Promise.all([
  		db.ref(boxes).set({}),
	  	db.ref(wods).set({}),
		db.ref(boxNamesTitle).set({}),
		db.ref(userBoxes).set({})]
	)
  	
  }

/*
	Wods
*/

export function setWod(boxID, title, wodText, scoreType){
  	let wodBoxPath = `wods/${boxID}`
	let wodID = db.ref(wodBoxPath).push().key

	let wodPath = `${wodBoxPath}/${wodID}`
	let shallowPath = `shallow/${wodBoxPath}/${wodID}` // able to query at boxid for wods

	
	let updates = {}
	updates[shallowPath] = true 
	updates[wodPath] = {
		boxID: boxID,
		wodID: wodID,
		title: title,
		scoreType: scoreType,
		wodText: wodText,
		date: Date.now()
	}
	return db.ref().update(updates)
	

	
  }
export function editWod(boxID, wodID, title, wodText, scoreType){
	let wodBoxPath = `wods/${boxID}/${wodID}`

	return db.ref(wodBoxPath).update({
		title: title,
		wodText: wodText,
		scoreType: scoreType
	})
}


// delete wod plus its scores from wods and scores nodes in Firebase
// leaving scores under users node for now.
export function removeWod(wodPath, scorePath){
	// let wodPath = `wods/${this.state.curRemoveWodBoxID}/${this.state.curRemoveWodID}`
	// let scorePath = `scores/${this.state.curRemoveWodID}`

	return new Promise((res, rej) => {
		try{
			db.ref(wodPath)
			.remove()
			.then(()=>{
				db.ref(scorePath)
				.remove()
				.then(() => {
					res("Deleting complete")
				})
			})
		}catch{
			rej("error while deleting Wod")
		}
	})
}



