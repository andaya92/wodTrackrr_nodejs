/*
	Scores
*/

import firebase from "../../context/firebaseContext"
import "firebase/auth"; 
import "firebase/storage";
import "firebase/database"; 
var storage = firebase.storage()
var db = firebase.database();


export function setScore(title, username, uid, userScore, wodID, boxID,
						scoreType){
	return new Promise((res, rej) => {
		db.ref(`scores`)
		.orderByChild("wodID")
		.equalTo(wodID)
		.once("value", ss => {
			console.log("User has score? Check if uid in here")
			let scoreID = ""

			if(ss && ss.exists()){
				let value = ss.val()
				let hasScore = false
				Object.keys(value).forEach(key => {
					if(value[key].uid === uid){
						scoreID = key
					}
				})
			}
			if(!scoreID.length > 0){
				scoreID = db.ref(`scores`).push().key
			}

			db.ref(`scores/${scoreID}`).set({
				scoreID:scoreID,
				uid: uid,
				wodID: wodID,
				boxID: boxID,
				username: username,
				title: title,
				score: userScore,
				scoreType: scoreType,
				date: Date.now()
			})
			.then(() => res("Successfully added score to users."))
			.catch(() => rej("Failed to add score to users."))	
		})
	})
}

export function removeScore(scoreID){
	return new Promise((res, rej) => {
		db.ref(`scores/${scoreID}`)
		.remove()
		.then(()=>{res(`Successfully removed score: ${scoreID}`)})
		.catch((err) => {rej(`Failed to remove score: ${scoreID}`)})
	})	
}
