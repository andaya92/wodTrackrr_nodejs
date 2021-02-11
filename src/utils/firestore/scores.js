/*
	Scores
*/

import firebase from "../../context/firebaseContext"
import "firebase/auth"; 
import "firebase/firestore"; 

let fs = firebase.firestore();


export function setScore(title, username, uid, userScore, wodID, boxID,
						scoreType){
	return new Promise((res, rej) => {
		let data = {
				uid: uid,
				wodID: wodID,
				boxID: boxID,
				username: username,
				title: title,
				score: userScore,
				scoreType: scoreType,
				date: Date.now()
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
				data['scoreID'] = key
				fs.collection("scores").doc(key).set(data)
				.then(() => {res("Updated score.")})
				.catch(err => {rej(err)})
			}else{
				let doc = fs.collection("scores").doc()
				data['scoreID'] = doc.id
				doc.set(data)
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
