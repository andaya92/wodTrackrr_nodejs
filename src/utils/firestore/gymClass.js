import firebase from "../../context/firebaseContext"
import "firebase/firestore";

let fs = firebase.firestore();

export default function mTea(){}

const GYM_CLASSES = "gymClasses"
const CLASSES = "classes"
const CLASS_OWNERS ="classOwners"
/*
	GymClasses
*/

export function getGymClasses(boxID){
	return fs.collection("gymClasses").doc(boxID).collection("classes")
}

export function setGymClass(title, uid, boxID, boxTitle, isPrivate){
  	return new Promise((res, rej) => {
  		fs.collection(GYM_CLASSES)
		.doc(boxID)
		.collection(CLASSES)
		.where("title", "==", title)
  		.get().then(result => {
  			if(result.empty){
				let doc = fs
				.collection(GYM_CLASSES)
				.doc(boxID)
				.collection(CLASSES)
				.doc()

				fs.collection(CLASS_OWNERS)
				.doc(doc.id).collection("users").doc(uid)
				.set({
					owner: uid,
					boxID: boxID,
					gymClassID: doc.id,
					isPrivate: isPrivate,
				})


		  		doc.set({
		  			gymClassID: doc.id,
		  			boxID: boxID,
		  			boxTitle: boxTitle,
		  			title: title,
		  			uid, uid,
					isPrivate: isPrivate,
		  			date: Date.now()
		  		})
		  		.then(()=>{
		  			res("Added gymClass")
		  		})
				  .catch(err => { rej(err) })
  			}else{
  				res("Name Taken")
  			}
  		})
		.catch(err => {rej(err)})
  	})
 }


function getSnapshot(collectionName, fieldName, fieldID, res, rej){
	const batch = fs.batch()
	let snapshotSize = 0
	fs.collection(collectionName).where(fieldName, "==", fieldID).get()
	.then(ss => {
		let cnt = 0
		snapshotSize = ss.size

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

export function removeGymClass(boxID, gymClassID){
	// let collectionNames = ['classMembers', 'classAdmins']
	let collectionNames = [
		`scores`,
		`wods/${gymClassID}/wods`,
		`classAdmins`, `classMembers`,
		"notifications/admins/invites", "notifications/members/invites",
		`classAdminsShallow/${gymClassID}/users`,
		`classMembersShallow/${gymClassID}/users`,
		`classOwners/${gymClassID}/users/`,
		`gymClasses/${boxID}/classes`]

	let promises = collectionNames.map(name => {
		return new Promise((res, rej) => {
			getSnapshot(name, "gymClassID", gymClassID, res, rej)
		})
	})

	return Promise.all(promises)
}