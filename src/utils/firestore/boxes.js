import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/firestore";

import { removeGymClass } from "./gymClass"

let fs = firebase.firestore();

export default function mTea(){}

/*
	Boxes
*/

export function setBox(title, description, uid){

  	return new Promise((res, rej) => {
  		fs.collection("boxes").where("title", "==", title)
  		.get().then(result => {
  			if(result.empty){
				let doc = fs.collection("boxes").doc()
		  		doc.set({
		  			boxID: doc.id,
		  			title: title,
					description: description,
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


 export function updateBoxInfo(){
	// TODO() update bbox info
	return true
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


function deleteUserFollowing(boxID, res, rej){
	const batch = fs.batch()
	fs.collection("followers").doc(boxID)
	.collection("followers")
	.get()
	.then(ss => {
		let cnt = 0
		if(!ss.empty){
			let following = []
			ss.forEach(doc => {
				following.push(
					fs.collection("userFollowing").doc(doc.data().uid)
					.collection("following").doc(boxID).get()
				)
			})
			Promise.all(following)
			.then((docs) => {
				for(let doc of docs){
					batch.delete(doc.ref)
					cnt++
				}
				batch.commit().then(() => {
					if(cnt >= 500)  // bacth limits to 500 changes
					deleteUserFollowing(boxID, res, rej)
				})
				.catch(err => {
					console.log(err)
					rej(err.message)
				})
			})
			.catch( err => {

			})

		}else{
			res(1)
		}

	})
	.catch( err => {
		console.log(err)
		rej(err.message)
	})
	res(1)
}

function deleteFollowers(boxID, res, rej){
	const batch = fs.batch()
	fs.collection("followers").doc(boxID)
	.collection("followers")
	.get()
	.then(ss => {
		let cnt = 0
		if(!ss.empty){
			let following = []
			ss.forEach(doc => {
				batch.delete(doc.ref)
				cnt++

			})
			batch.commit().then(() => {
				if(cnt >= 500)  // bacth limits to 500 changes
				deleteFollowers(boxID, res, rej)
			})
			.catch(err => {
				console.log(err)
				rej(err.message)
			})
		}else{
			res(1)
		}

	})
	.catch( err => {
		console.log(err)
		rej(err.message)
	})
	res(1)
}

function removeUserFollowing(boxID){
	return new Promise((res, rej) => {
		deleteUserFollowing(boxID, res, rej)
	})
}

function removeFollowers(boxID){
	return new Promise((res, rej) => {
		deleteFollowers(boxID, res, rej)
	})
}

function removeFollowersAndUserFollowing(boxID){
	return new Promise((res, rej) => {
		removeUserFollowing(boxID)
		.then(() => {
			removeFollowers(boxID)
			.then(() => {
				console.log("Removed Followers")
				res(true)
			})
		})
		.catch(err => {
			console.log(err)
			rej(err)
		})
	})
}

function removeGymClasses(boxID){
	return new Promise((res, rej) => {
		fs.collection("gymClasses").doc(boxID).collection("classes")
		.get().then( ss => {
			console.log(ss)
			if(!ss.empty){
				let promises = []
				ss.docs.forEach( doc => {
					console.log("Remove class w. data: ")
					console.log(doc.data())
					promises.push(removeGymClass(doc.data()))

				})
				Promise.all(promises)
				.then((result) => {
					// Remove followers & then boxes
					fs.collection("userFollowing").doc(boxID)
					console.log(result)
					res(result)
				})
				.catch(err => {
					console.log(err)
					rej(err.message)
				})


			}else{
				res(false)
			}
		})
		.catch(err => {
			console.log(err)
			rej(err.message)
		})
	})
}

function removeClassesandFollowers(boxID){
	return Promise.all([
		removeFollowersAndUserFollowing(boxID),
		removeGymClasses(boxID),
	])
}

export function removeBox(boxID){
	return new Promise((res, rej) => {
		removeClassesandFollowers(boxID)
		.then((result) => {
			fs.collection("boxes").doc(boxID)
			.get()
			.then( ss => {
				console.log(ss)
				if(ss.exists){
					ss.ref.delete()
					.then(() => {
						res("Deleted box!")
					})
					.catch( err => {
						console.log(err)
						rej(err.message)
					})
				}
			})
			.catch(err => {
				console.log(err)
				rej(err.message)
			})

		})
		.catch(err => {
			console.log(err)
			rej(err.message)
		})



	})

}