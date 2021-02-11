/*
	Followers
*/
import firebase from "../../context/firebaseContext"
import "firebase/auth"; 
import "firebase/storage";
import "firebase/database"; 
var storage = firebase.storage()
var db = firebase.database();

export default function mTea(){}

export function isFollowing(uid, boxID){
	return new Promise((res, rej) => {
		db.ref(`users/${uid}/following`).orderByChild(boxID).equalTo(boxID)
		.once("value", following =>{
			if(following && following.exists()){
				res(true)
			}
			res(false)
		})
		.catch(err => {rej(err)})
	})
}

export function setFollow(uid, boxID){
	let key = db.ref("followers").push().key
	let updates = {}
	let data = {
		uid: uid,
		boxID: boxID,
		followID: key,
		date: Date.now()
	}
	updates[`followers/${key}`] = data
	updates[`users/${uid}/following/${key}`] = data
	return new Promise((res, rej) => {
		 db.ref().update(updates)
		 .then(() => {
		 	res(true)
		 })
		 .catch(error => {rej(error)})
	})
}


export function removeFollow(uid, followID){
	let updates = {}
	let data = {}
	updates[`followers/${followID}`] = data
	updates[`users/${uid}/following/${followID}`] = data
	return new Promise((res, rej) => {
		db.ref().update(updates)
		.then(() => {res(true)})
		.catch(err => rej(err))
	})
}


export function getUserFollowers(uid){
	return db.ref(`users/${uid}/following`)
}

export function getBoxFollowers(boxID){
	return db.ref("followers").orderByChild("boxID").equalTo(boxID)
				
}