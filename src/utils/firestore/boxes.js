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
		  			res(doc.id)
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
						  "classAdmins",
						//   "classMembers",
						  "classAdminsShallow",
						  "classMembersShallow",

						  "following",
						  "scores"]

	let promises = collectionNames.map(name => {
		return new Promise((res, rej) => {
			batchDelete(name, "boxID", boxID, res, rej)
		})
	})

	//delete classes

	fs.collection(`gmyClasses/${boxID}/classes`)



	promises.push(new Promise((res, rej) => {
		batchUpdate("following", "boxID", boxID, res, rej)
	}))

	return Promise.all(promises).then(()=> {
		console.log("Waiting...")
		new Promise(resolve => setTimeout(resolve, 5000)).then(() => {
			console.log("Waited 5 seconds")
			new Promise((res, rej) => {
				// batchDelete("classOwners", "boxID", boxID, res, rej)
				// batchDelete("boxes", "boxID", boxID, res, rej)
				// batchDelete(`gymClasses/${boxID}/classes`, "boxID", boxID, res, rej)
			})
		})
	})
}