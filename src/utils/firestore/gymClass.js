import firebase from "../../context/firebaseContext"
import "firebase/firestore";

let fs = firebase.firestore();

export default function mTea(){}

/*
	GymClasses
*/

export function getGymClasses(boxID){
	return fs.collection("gymClasses").where("boxID", "==", boxID)
}

export function setGymClass(title, uid, boxID, boxTitle){
  	return new Promise((res, rej) => {
  		fs.collection("gymClasses").where("title", "==", title)
  		.get().then(result => {
  			if(result.empty){
					let doc = fs.collection("gymClasses").doc()
		  		doc.set({
		  			gymClassID: doc.id,
		  			boxID: boxID,
		  			boxTitle: boxTitle,
		  			title: title,
		  			uid, uid,
		  			date: Date.now()
		  		})
		  		.then(()=>{
		  			res("Added gymClass")
		  		})

  			}else{
  				rej("Name Taken")
  			}
  		})
  	})
 }


function getSnapshot(collectionName, fieldName, fieldID, res, rej){
	const batch = fs.batch()
	let snapshotSize = 0
	fs.collection(collectionName).where(fieldName, "==", fieldID).get()
	.then(ss => {
		let cnt = 0
		snapshotSize = ss.size
		
		ss.forEach(doc => {
			batch.delete(doc.ref)
			cnt++
		})
		
		batch.commit().then(() => {
			if(cnt >= 500)
				getSnapshot(collectionName, fieldName, fieldID, res, rej)
		})
		.catch(err => rej(0))
	})
	res(1)
}

export function removeGymClass(gymClassID){
	let collectionNames = ["wods", "scores", "gymClasses"]

	let promises = collectionNames.map(name => {
		return new Promise((res, rej) => {
			getSnapshot(name, "gymClassID", gymClassID, res, rej)
		})
	})
	
	return Promise.all(promises)
}