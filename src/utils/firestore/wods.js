import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/firestore";



export default function mTea(){}

/*
	Wods
*/
let fs = firebase.firestore();

export function getWods(gymClassID){
	let doc = fs.collection("wods").doc(gymClassID).collection("wods")
	console.log(doc)
	return doc
}

export function getWod(gymClassID, wodID){
	return fs.collection("wods").doc(gymClassID).collection("wods").doc(wodID)

}

export function setWod(data){

	let doc = fs.collection("wods").doc(data.gymClassID).collection("wods").doc()
	return doc.set({ ...data, date: Date.now(), wodID: doc.id })
}

export function editWod(data){
	let fs = firebase.firestore()
	console.log("Edit wod")
	console.log(data)
	return new Promise((res, rej) => {
		fs.collection("wods").doc(data.gymClassID)
		.collection("wods").doc(data.wodID)
		.update(data)
		.then(()=> {res("Finished updating.")})
		.catch(err => {rej(err)})
	})
}



function getSnapshot(collectionName, fieldName, fieldID, res, rej){

	const batch = fs.batch()
	fs.collection(collectionName).where(fieldName, "==", fieldID).get()
	.then(ss => {
		let cnt = 0
		if(ss.size == 0) res(1)

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

export function removeWod(wodInfo){

	let collectionNames = [`wods/${wodInfo.gymClassID}/wods`, "scores"]

	let promises = collectionNames.map(name => {
		return new Promise((res, rej) => {
			getSnapshot(name, "wodID", wodInfo.wodID, res, rej)
		})
	})

	return Promise.all(promises)
}



