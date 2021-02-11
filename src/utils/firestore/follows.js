import firebase from "../../context/firebaseContext"
import "firebase/auth"; 
import "firebase/firestore";

export default function mTea(){}




export function removeFollow(followID){
	const fs = firebase.firestore()

	return new Promise((res, rej) => {
		fs.collection("following").doc(followID).delete()
		.then(() => {
			res("Finished delete.")
		})
		.catch(err => {rej(err)})
	})
}

export function setFollow(uid, username, boxID, title){
	let fs = firebase.firestore()
	return new Promise((res, rej) => {
		fs.collection("following").where("uid", "==", uid).get()
		.then(ss => {
			let isFollowing = false
			if(!ss.empty){
				ss.forEach(doc => {
					if(doc.data().boxID === boxID)
						isFollowing = true
				})
			}

			if(!isFollowing){
				let doc = fs.collection("following").doc()
				let data = {
					followID: doc.id,
					uid: uid,
					username: username,
					boxID: boxID,
					title: title,
					date: Date.now()
				}
				doc.set(data).then(() => {res("Followed.")})
				.catch(err => {rej(err)})
			}
		})
	})
}