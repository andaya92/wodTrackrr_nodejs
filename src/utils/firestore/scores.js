/*
	Scores
*/

import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/firestore";

let fs = firebase.firestore();


export function setScore(title, username, uid, userScore, wodID, gymClassID, boxID,
						scoreType){
	return new Promise((res, rej) => {
		let data = {
				uid: uid,
				wodID: wodID,
				gymClassID: gymClassID,
				boxID: boxID,
				username: username,
				title: title,
				score: userScore,
				scoreType: scoreType
			}
		fs.collection("scores")
		.where("uid", "==", uid)
		.where("wodID", "==", wodID)
		.get().then(ss => {
			let key = ""
			console.log(ss)
			if(!ss.empty){
				ss.forEach(doc => {
					key = doc.data().scoreID
				})

				fs.collection("scores")
				.doc(key)
				.update({
					...data,
					scoreID: key
				})
				.then(() => {res("Updated score.")})
				.catch(err => {rej(err)})
			}else{
				let doc = fs.collection("scores").doc()
				doc.set({
					...data,
					date: Date.now(),
					scoreID: doc.id
				})
				.then(() => {res("Added new score.")})
				.catch(err => {rej(err)})
				// Create score
			}
		},
			err => {
				rej(err)
		})
	})
}

export function removeScore(scoreID){
	return new Promise((res, rej) => {
		fs.collection("scores").doc(scoreID).delete()
		.then(()=>{res(`Successfully removed score: ${scoreID}`)})
		.catch((err) => {rej(`Failed to remove score: ${scoreID}`)})
	})
}
