import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/firestore";



export default function mTea(){}

/*
	Wods
*/
let fs = firebase.firestore();

export function getWods(boxID, gymClassMD){
	let doc = fs.collection("wods").doc(boxID)
	.collection("classes").doc(gymClassMD.gymClassID)
	.collection("wods").where("isPrivate", "==", gymClassMD.isPrivate)
	.where("owner", "==", gymClassMD.owner)
	console.log(doc)
	return doc
}

export function getWod(boxID, gymClassID, wodID){
	return fs.collection("wods").doc(boxID)
	.collection("classes").doc(gymClassID)
	.collection("wods").doc(wodID)

}

export function setWod(title, boxID, gymClassID, owner, boxTitle, classTitle, scoreType, wodText, isPrivate){

	let doc = fs.collection("wods").doc(boxID)
	.collection("classes").doc(gymClassID)
	.collection("wods").doc()

	let data = {
		title: title,
		boxID: boxID,
		gymClassID: gymClassID,
		owner: owner,
		boxTitle: boxTitle,
		classTitle: classTitle,
		scoreType: scoreType,
		wodText: wodText,
		isPrivate: isPrivate,
		date: Date.now(),
		wodID: doc.id
	}
	return new Promise((res, rej) => {
		doc.set(data)
		.then(() => {
			res(doc.id)
		})
		.catch(err => {
			rej(err)
		})
	})
}

export function editWod(boxID, gymClassID, wodID, title, wodText){
	let fs = firebase.firestore()
	let data = {
		title: title,
		wodText: wodText,
	}

	return new Promise((res, rej) => {
		fs.collection("wods").doc(boxID)
		.collection("classes").doc(gymClassID)
		.collection("wods").doc(wodID)
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

	let collectionNames = [`wods/${wodInfo.boxID}/classes/${wodInfo.gymClassID}/wods/${wodInfo.wodID}`, "scores"]

	let promises = collectionNames.map(name => {
		return new Promise((res, rej) => {
			getSnapshot(name, "wodID", wodInfo.wodID, res, rej)
		})
	})

	return Promise.all(promises)
}



