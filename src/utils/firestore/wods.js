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


function deleteCollection(collectionName, fieldName, fieldID, res, rej){
	/* General form to delete a collection by field name.

	*/
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
			deleteCollection(collectionName, fieldName, fieldID, res, rej)
		})
		.catch(err => {
			console.log(err)
			rej(err)
		})
	})
	.catch(err => {
		console.log(err)
		rej(err)
	})
	res(1)
}


function deleteUserScores(wodInfo, res, rej){
	/*
		Gets collection queries for users that have scores and deletes them.
	*/
	const batch = fs.batch()
	getScoreUIDs(wodInfo).then(scoreUIDs => {
		if(scoreUIDs == null){
			res(false)
		}
		let promises = scoreUIDs.map(uid => {
			return fs.collection("userScores").doc(uid).collection("scores").where("wodID", "==", wodInfo.wodID).get()
		})

		let cnt = 0
		Promise.all(promises).then( result => {
			result.forEach( ss => {
				if(ss.size == 0) res(true)

				console.log(ss)
				if(!ss.empty){
					ss.forEach(doc => {
						console.log(doc)
						batch.delete(doc.ref)
						cnt++
					})

				}
			})
		})
		.then(() => {
			batch.commit().then(() => {
				if(cnt >= 500)
					deleteUserScores(wodInfo, res, rej)
				res(true)
			})
			.catch(err => {
				console.log(err)
				rej(err)
			})
		})
	})
	.catch(err => {
		console.log(err)
		rej(err)
	})

}

function getScoreUIDs(wodInfo){
	/* Get current scoreIDs for a wod.
	*/
	let wodPath = `${wodInfo.boxID}/classes/${wodInfo.gymClassID}/wods/${wodInfo.wodID}`
	let scorePath = `scores/${wodPath}/scores`
	return new Promise((res, rej) => {
		fs.collection(scorePath)
		.get().then(ss =>{
			let scoreUIDs = []
			if(!ss.empty){
				ss.forEach(doc => {
					scoreUIDs.push(doc.data().uid)
				})
				console.log(scoreUIDs)
				res(scoreUIDs)
			}
			res(null)
		})
		.catch(err => {
			console.log(err)
			rej(err)
		})
	})
}


function removeScoresFromWod(wodInfo){
	/* Deletes scores stored under userScores
	 */
	return new Promise((res, rej) => {
		deleteUserScores(wodInfo, res, rej)
	})
}



export function removeWod(wodInfo){
	/*Removes wod and its scores.

	Deletes userScores, scores and finally the wod.


	*/

	// return Promise.all(promises)
	return new Promise((res, rej) => {
		removeScoresFromWod(wodInfo)
		.then((removed) => {
			return new Promise((res, rej) => {
				console.log("scores removed? ", removed)
				if(removed){
					// Remove scores
					deleteCollection(
						`scores/${wodInfo.boxID}/classes/${wodInfo.gymClassID}/wods/${wodInfo.wodID}/scores`,
						"wodID",
						wodInfo.wodID,
						res,
						rej
					)
				}else{
					res(true)
				}
			})
			.then(() => {
				// Remove wod
				fs.collection(`wods/${wodInfo.boxID}/classes/${wodInfo.gymClassID}/wods`)
				.doc(wodInfo.wodID)
				.delete()
				res(true)
			})
			.catch(err => {
				console.log(err)
			})
		})
		.catch(err => {
			console.log(err)
		})

	})
}



