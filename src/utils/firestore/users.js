import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/firestore";

let fs = firebase.firestore();

export default function mTea(){}



function updateScores(uid, username, data){
	let promises = []
	return new Promise((res, rej) => {
		fs.collection("scores").where("uid", "==", uid)
		.get()
		.then(scoresSS => {
			promises.push(...scoresSS.docs.map(doc => {
				console.log(doc.data())
				return fs.collection("scores").doc(doc.data().scoreID).update(data)
			}))
			Promise.all(promises)
			.then(() => {res("Updated scores!")})
			.catch(err => {console.log(err);rej(err)})
		})
		.catch(err => {
			if(err.code === "permission-denied"){
				res("User has no scores")
				return
			}
			rej(err)
		})
	})
}


function updateFollowing(uid, username, data){
	let promises = []
	return new Promise((res, rej) => {
		fs.collection("following").where("uid", "==", uid)
		.get()
		.then(followingSS => {
			promises.push(...followingSS.docs.map(doc => {
				console.log(doc.data())
				return fs.collection("following").doc(doc.data().followID).update(data)
			}))

			Promise.all(promises)
			.then(() => {res("Updated following!")})
			.catch(err => {console.log(err);rej(err)})
		})
		.catch(err => {
			if(err.code === "permission-denied"){
				res("User is not following any gyms.")
				return
			}
			rej(err)
		})
	})
}

export function setUsername(uid, username){
	let data = {username: username}
	let promises = [
		fs.collection("users").doc(uid).update(data),
		updateScores(uid, username, data),
		updateFollowing(uid, username, data)
	]

	return new Promise((res, rej) => {
		Promise.all(promises)
		.then( () => {
			res("Done updating username.")
		})
		.catch(err => {
			rej(err)
		})
	})
}