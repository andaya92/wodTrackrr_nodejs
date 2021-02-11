import firebase from "../../context/firebaseContext"
import "firebase/auth"; 
import "firebase/firestore";

let fs = firebase.firestore();

export default function mTea(){}

/*
	Boxes
*/

export function setBox(title, uid){

  	return new Promise((res, rej) => {
  		fs.collection("boxes").where("title", "==", title)
  		.get().then(result => {
  			if(result.empty){
					let doc = fs.collection("boxes").doc()
		  		doc.set({
		  			boxID: doc.id,
		  			title: title,
		  			uid, uid,
		  			date: Date.now()
		  		})
		  		.then(()=>{
		  			res("Added box")
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

export function removeBox(boxID){
	let collectionNames = ["wods", "scores", "boxes"]

	let promises = collectionNames.map(name => {
		return new Promise((res, rej) => {
			getSnapshot(name, "boxID", boxID, res, rej)
		})
	})
	
	return Promise.all(promises)
}