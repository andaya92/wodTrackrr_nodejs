import firebase from "../../context/firebaseContext"
import "firebase/firestore";

let fs = firebase.firestore();

export default function mTea(){}

/*
	GymClasses
*/

export function getGymClasses(boxID){
	return fs.collection("gymClasses").doc(boxID).collection("classes")
}

export function setGymClass(title, uid, boxID, boxTitle, isPrivate){
  	return new Promise((res, rej) => {
  		fs.collection("gymClasses")
		.doc(boxID)
		.collection("classes")
		.where("title", "==", title)
  		.get().then(result => {
			console.log(result)
  			if(result.empty){
				let doc = fs
				.collection("gymClasses")
				.doc(boxID)
				.collection("classes")
				.doc()

		  		doc.set({
		  			gymClassID: doc.id,
		  			boxID: boxID,
		  			boxTitle: boxTitle,
		  			title: title,
		  			uid, uid,
					isPrivate: isPrivate,
		  			date: Date.now()
		  		})
		  		.then(()=>{
		  			res("Added gymClass")
		  		})
				  .catch(err => { rej(err) })
  			}else{
  				res("Name Taken")
  			}
  		})
		.catch(err => {rej(err)})
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

export function removeGymClass(boxID, gymClassID){
	let collectionNames = ["wods", "scores", `gymClasses/${boxID}/classes`, 'classMembers', 'classAdmins']

	let promises = collectionNames.map(name => {
		return new Promise((res, rej) => {
			getSnapshot(name, "gymClassID", gymClassID, res, rej)
		})
	})
	
	return Promise.all(promises)
}