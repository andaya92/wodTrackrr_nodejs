import firebase from "../../context/firebaseContext"
import "firebase/auth"; 
import "firebase/firestore";

let fs = firebase.firestore();

export default function mTea(){}

/*
	Boxes
*/

export function setBox(title, uid){

  	return new Promise((res, rej) => {
  		fs.collection("boxes").where("title", "==", title)
  		.get().then(result => {
  			if(result.empty){
					let doc = fs.collection("boxes").doc()
		  		doc.set({
		  			boxID: doc.id,
		  			title: title,
		  			uid, uid,
		  			date: Date.now()
		  		})
		  		.then(()=>{
		  			res("Added box")
		  		})

  			}else{
  				rej("Name Taken")
  			}
  		})
  	})
 }


function batchDelete(collectionName, fieldName, fieldID, res, rej){
	const batch = fs.batch()
	fs.collection(collectionName).where(fieldName, "==", fieldID).get()
	.then(ss => {
		let cnt = 0
		
		ss.forEach(doc => {
			batch.delete(doc.ref)
			cnt++
		})
		
		batch.commit().then(() => {
			if(cnt >= 500)  // bacth limits to 500 changes
			batchDelete(collectionName, fieldName, fieldID, res, rej)
		})
		.catch(err => rej(0))
	})
	res(1)
}

function batchUpdate(collectionName, fieldName, fieldID, res, rej){
	const batch = fs.batch()
	fs.collection(collectionName).where(fieldName, "==", fieldID).get()
	.then(ss => {
		let cnt = 0
		
		ss.forEach(doc => {
			batch.update(doc.ref, {
				boxID: ""
			})
			cnt++
		})
		
		batch.commit().then(() => {
			if(cnt >= 500)  // bacth limits to 500 changes
			batchUpdate(collectionName, fieldName, fieldID, res, rej)
		})
		.catch(err => rej(0))
	})
	res(1)
}

export function removeBox(boxID){
	/*
		boxes
		classAdmin
		classMember
		following
		 - remove boxID
		 - allows user to see their follows after box is deleted
		 - once user unfollows, it will no longer appear
		gymClasses
		scores
		wods
		users
			-uid/
	*/

	let collectionNames = ["notifications/admins/invites",
						  "notifications/members/invites",
						  "classAdmins", "classMembers",
						  `gymClasses/${boxID}/classes`,
						  "wods",
						  "scores",
						  "boxes"]

	let promises = collectionNames.map(name => {
		return new Promise((res, rej) => {
			batchDelete(name, "boxID", boxID, res, rej)
		})
	})

	promises.push(new Promise((res, rej) => {
		batchUpdate("following", "boxID", boxID, res, rej)
	}))

	return Promise.all(promises)
}