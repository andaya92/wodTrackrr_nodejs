/*
	Scores
*/

import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/firestore";

let fs = firebase.firestore();

export function getWodScores(boxID, gymClassID, wodID, date){
	console.log(date)
	return fs.collection("scores").doc(boxID)
			.collection("classes").doc(gymClassID)
			.collection("wods").doc(wodID)
			.collection("scores").where("date", ">=", date)
}

export function getUserScores(uid, field, value){
	return fs.collection("userScores").doc(uid)
		.collection("scores")
		.where(field, ">=", value)
}

export function setScore(title, boxID, gymClassID, wodID, owner, uid, username, userScore, scoreType){
	return new Promise((res, rej) => {
		let data = {
			uid: uid,
			wodID: wodID,
			gymClassID: gymClassID,
			boxID: boxID,
			username: username,
			title: title,
			score: userScore,
			scoreType: scoreType,
			owner: owner,
			date: Date.now()
		}

		let doc = fs.collection("scores").doc(boxID)
		.collection("classes").doc(gymClassID)
		.collection("wods").doc(wodID)
		.collection("scores").doc(uid)

		let userDoc = fs.collection("userScores").doc(uid)
		.collection("scores")

		userDoc.where("wodID", "==", wodID)
		.get().then( ss => {
			console.log(ss)
			if(ss.empty){
				let scoreDoc = userDoc.doc()

				scoreDoc.set({
					...data,
					scoreID: scoreDoc.id
				})
			}else{
				let scoreID = ss.docs[0].data().scoreID
				userDoc.doc(scoreID).update(data)
			}
			doc.set(data)
			.then(() => {res("Added new score.")})
			.catch(err => {rej(err)})
		})
		.catch(err => {
			console.log(err)
		})
	})
}

export function updateScore(score, boxID, gymClassID, wodID, uid){
	return new Promise((res, rej) => {
		fs.collection("scores").doc(boxID)
		.collection("classes").doc(gymClassID)
		.collection("wods").doc(wodID)
		.collection("scores").doc(uid)
		.update({score: score})
		.then(() => {res("Updated score.")})
		.catch(err => {rej(err)})
	})
}

export function removeScore(boxID, gymClassID, wodID, uid, scoreID){
	return new Promise((res, rej) => {
		Promise.all([
			fs.collection("scores").doc(boxID)
			.collection("classes").doc(gymClassID)
			.collection("wods").doc(wodID)
			.collection("scores").doc(uid)
			.delete(),

			fs.collection("userScores").doc(uid)
			.collection("scores").where("wodID", "==", wodID)
			.get().then( ss => {
				console.log("userScores SS")
				console.log(ss)
				if(!ss.empty){
					ss.forEach( doc => {
						console.log(doc)
						doc.ref.delete()
					})
				}
			})
			.catch(err => {
				console.log(err)
				rej(err)
			})
		])
		.then(()=>{res(`Successfully removed score: ${wodID}`)})
		.catch((err) => {rej(err.message)})
	})
}
