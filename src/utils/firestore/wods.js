import firebase from "../../context/firebaseContext"
import "firebase/auth"; 
import "firebase/firestore";



export default function mTea(){}

/*
	Wods
*/

export function setWod(boxID, gymClassID, title, wodText, scoreType){
	let fs = firebase.firestore();
	let doc = fs.collection("wods").doc()
	let data = {
		wodID: doc.id,
		boxID: boxID,
		gymClassID: gymClassID,
		title: title,
		scoreType: scoreType,
		wodText: wodText,
		date: Date.now()
	}
	return doc.set(data)
}

export function editWod(boxID, wodID, title, wodText, scoreType){
	let fs = firebase.firestore()
	return new Promise((res, rej) => {
		fs.collection("wods").doc(wodID).update({
			boxID: boxID,
			title: title,
			wodText: wodText,
			scoreType: scoreType
		})
		.then(()=> {res("Finished updating.")})
		.catch(err => {rej(err)})
	})
}



function getSnapshot(collectionName, fieldName, fieldID, res, rej){
	let fs = firebase.firestore();
	const batch = fs.batch()
	fs.collection(collectionName).where(fieldName, "==", fieldID).get()
	.then(ss => {
		let cnt = 0
		if(ss.size == 0) res(1)
		
		ss.forEach(doc => {
			console.log("delete")
			console.log(doc.data())
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

export function removeWod(wodID){

	let collectionNames = ["wods", "scores"]

	let promises = collectionNames.map(name => {
		return new Promise((res, rej) => {
			getSnapshot(name, "wodID", wodID, res, rej)
		})
	})
	
	return Promise.all(promises)
}



