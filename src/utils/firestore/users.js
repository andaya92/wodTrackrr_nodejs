import firebase from "../../context/firebaseContext"
import "firebase/auth"; 
import "firebase/firestore";

let fs = firebase.firestore();

export default function mTea(){}


export function setUsername(uid, username){
	let data = {username: username}
	let promises = [fs.collection("users").doc(uid).update(data)]

	fs.collection("scores").where("uid", "==", uid)
	.get().then(ss => {
		let promises = ss.docs.map(doc => {
			console.log(doc.data())
			return fs.collection("scores").doc(doc.data().scoreID).update(data)
		})
	})

	fs.collection("following").where("uid", "==", uid)
	.get().then(ss => {
		let promises = ss.docs.map(doc => {
			console.log(doc.data())
			return fs.collection("following").doc(doc.data().followID).update(data)
		})
	})
	
	return new Promise((res, rej) => {
		Promise.all(promises)
		.then(() => {res("Updated!")})
		.catch(err => {rej(err)})
	})
}