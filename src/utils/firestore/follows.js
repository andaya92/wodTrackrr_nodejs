import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/firestore";

export default function mTea(){}




export function removeFollow(uid, boxID){
	const fs = firebase.firestore()

	return Promise.all([
		fs.collection("userFollowing").doc(uid)
		.collection("following").doc(boxID).delete(),
		fs.collection("followers").doc(boxID)
		.collection("followers").doc(uid).delete()
	])

}

export function getFollowsFromSS(ss){
	let boxIDs = []
	if(!ss.empty){
		ss.docs.forEach(follow => {
			boxIDs.push(follow.data().boxID)
		})

	}
	return boxIDs
}

export function getUserFollowers(uid){
	let fs = firebase.firestore()

	return fs.collection("userFollowing").doc(uid)
	.collection("following").where("uid", "==", uid)


}

export function setFollow(uid, username, boxID, title, owner){
	let fs = firebase.firestore()
	return new Promise((res, rej) => {
		let doc = fs.collection("userFollowing").doc(uid)
		.collection("following").doc(boxID)

		let userDoc = fs.collection("followers").doc(boxID)
		.collection("followers").doc(uid)

		let data = {
			uid: uid,
			owner: owner,
			username: username,
			boxID: boxID,
			title: title,
			date: Date.now()
		}
		Promise.all([
			doc.set(data),
			userDoc.set(data)
		])
		.then(() => {res("Followed.")})
		.catch(err => {rej(err)})


	})
}