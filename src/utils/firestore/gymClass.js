import firebase from "../../context/firebaseContext"
import "firebase/firestore"

let fs = firebase.firestore()

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



export function setGymClass(title, uid, boxID, boxTitle, isPrivate, owner){
	/* Sets the data for a new class.

		Adds two entries:
		THe first is for the list of class owners and the second entry is for
		the list of classes

	*/
  	return new Promise((res, rej) => {
  		fs.collection(GYM_CLASSES).doc(boxID)
		.collection(CLASSES)
		.where("title", "==", title)
  		.get().then(result => {
  			if(result.empty){
				let doc = fs.collection(GYM_CLASSES).doc(boxID)
				.collection(CLASSES).doc()

				doc.set({
					gymClassID: doc.id,
					boxID: boxID,
					boxTitle: boxTitle,
					title: title,
					uid, uid,
					isPrivate: isPrivate,
					owner: owner,
					date: Date.now(),

				})
		  		.then(()=>{
		  			res(doc.id)
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
		`gymClasses/${boxID}/classes`]

	let promises = collectionNames.map(name => {
		return new Promise((res, rej) => {
			getSnapshot(name, "gymClassID", gymClassID, res, rej)
		})
	})

	return Promise.all(promises).then(()=> {
		new Promise((res, rej) => {
			getSnapshot("classOwners", "gymClassID", gymClassID, res, rej)
		})
	})
}