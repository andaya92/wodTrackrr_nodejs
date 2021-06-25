import firebase from "../../context/firebaseContext"
import "firebase/firestore"

import { removeAdmin } from "./classAdmin"
import { removeWod } from "./wods"
import { removeMember } from "./classMember"
import { deleteClassImage } from './classImages'

let fs = firebase.firestore()


export default function mTea(){}

const GYM_CLASSES = "gymClasses"
const CLASSES = "classes"
const ADMIN_NOTIFICATIONS = "adminNotifications"
/*
	GymClasses
*/

export function getGymClasses(boxID){
	return fs.collection("gymClasses").doc(boxID).collection("classes")
}



export function setGymClass(title, uid, boxID, boxTitle, isPrivate, owner, description){
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
					uid: uid,
					isPrivate: isPrivate,
					owner: owner,
					description: description,
					date: Date.now(),

				})
		  		.then(()=>{
		  			res(doc.id)
		  		})
				.catch(err => { rej(err) })
  			}else{
  				rej({message: "Name Taken!"})
  			}
  		})
		.catch(err => {rej(err)})
  	})
 }

 export function updateClassInfo(boxID, gymClassID, description){
	return new Promise((res, rej) => {
		fs.collection("gymClasses").doc(boxID)
		.collection("classes").doc(gymClassID)
		.update({
			description: description
		}).then(() => {
			console.log("Updated description.")
			res("Updated description.")
		}).catch( err => {
			console.log(`UpdateClassInfo Error: ${err.toString()}`)
			console.log(err)
			rej(err.message)
		})
	})
 }


// function deleteCollection(collectionName, fieldName, fieldID, res, rej){
// 	const batch = fs.batch()
// 	let snapshotSize = 0
// 	fs.collection(collectionName).where(fieldName, "==", fieldID).get()
// 	.then(ss => {
// 		let cnt = 0
// 		snapshotSize = ss.size

// 		ss.forEach(doc => {
// 			batch.delete(doc.ref)
// 			cnt++
// 		})

// 		batch.commit().then(() => {
// 			if(cnt >= 500)
// 			deleteCollection(collectionName, fieldName, fieldID, res, rej)
// 		})
// 		.catch(err => rej(0))
// 	})
// 	res(1)
// }




function getWodIDs(boxID, gymClassID, isPrivate){
	return new Promise((res, rej) => {
		fs.collection("wods").doc(boxID).collection("classes").doc(gymClassID)
		.collection("wods").where("isPrivate", "==", isPrivate)
		.get().then(ss => {
			console.log(ss)
			let ids = []
			if(!ss.empty){
				ss.forEach(doc => {
					ids.push(doc.data().wodID)
				})
				console.log(ids)
				res(ids)
			}
			res(false)
		})
		.catch(err => {
			console.log(err)
			rej(err)
		})
	})
}


const CLASS_ADMIN = "classAdmins"
const ADMINS = "admins"

function removeAdminsFromClass(wodInfo){
	return new Promise((res, rej) => {
		getAdminUIDs(wodInfo).then(uids => {
			if(uids == null){
				res(false)
				return
			}
			let promises = uids.map(uid => {
				let data = {
					boxID: wodInfo.boxID,
					gymClassID: wodInfo.gymClassID,
					uid: uid
				}
				return removeAdmin(data)
			})
			Promise.all(promises)
			.then(() => {
				res(true)
			})
			.catch(err => {
				rej(err)
			})
		})

	})
}
function getAdminUIDs(gymClassInfo){
	return new Promise((res, rej) => {
		fs.collection(CLASS_ADMIN).doc(gymClassInfo.boxID)
        .collection(CLASSES).doc(gymClassInfo.gymClassID)
        .collection(ADMINS)
		.get().then(ss =>{
			let UIDs = []
			if(!ss.empty){
				ss.forEach(doc => {
					UIDs.push(doc.data().uid)
				})
				console.log(UIDs)
				res(UIDs)
			}
			res(null)
		})
		.catch(err => {
			console.log(err)
			rej(err)
		})
	})
}


const CLASS_MEMBER = "classMembers"
const MEMBERS = "members"

function removeMembersFromClass(wodInfo){
	return new Promise((res, rej) => {
		getMemberUIDs(wodInfo).then(uids => {
			if(uids == null){
				res(false)
				return
			}
			let promises = uids.map(uid => {
				let data = {
					boxID: wodInfo.boxID,
					gymClassID: wodInfo.gymClassID,
					uid: uid
				}
				return removeMember(data)
			})
			Promise.all(promises)
			.then(() => {
				res(true)
			})
			.catch(err => {
				rej(err)
			})
		})

	})
}
function getMemberUIDs(gymClassInfo){
	return new Promise((res, rej) => {
		fs.collection(CLASS_MEMBER).doc(gymClassInfo.boxID)
        .collection(CLASSES).doc(gymClassInfo.gymClassID)
        .collection(MEMBERS)
		.get().then(ss =>{
			let UIDs = []
			if(!ss.empty){
				ss.forEach(doc => {
					UIDs.push(doc.data().uid)
				})
				console.log(UIDs)
				res(UIDs)
			}
			res(null)
		})
		.catch(err => {
			console.log(err)
			rej(err)
		})
	})
}


const NOTIFICATIONS = "notifications"
const USER_NOTIFICATIONS = "userAdminNotifications"

export function removeAdminNotification(notify){
    return new Promise((res, rej) => {
			fs.collection(USER_NOTIFICATIONS).doc(notify.uid)
			.collection(NOTIFICATIONS).where("uid", "==", notify.uid)
			.get().then(ss => {
				console.log(ss)

				if(!ss.empty){

					ss.forEach(doc => {
						doc.ref.delete()
					})
				}

				fs.collection(ADMIN_NOTIFICATIONS).doc(notify.boxID)
                .collection(CLASSES).doc(notify.gymClassID)
                .collection(ADMIN_NOTIFICATIONS).doc(notify.uid)
                .delete()
				.catch(err => {console.log(err)})
			})
            .then( () => {
                res("Removed notification.")
            })
            .catch(err => {
                console.log(err)
                rej(err)
            })

    })
}


function removeAdminInvitesFromClass(gymClassInfo){
	return new Promise((res, rej) => {
		getAdminInviteIDs(gymClassInfo).then(uids => {
			console.log(uids)
			if(uids == null){
				res(false)
				return
			}
			let promises = uids.map(uid => {
				let data = {
					boxID: gymClassInfo.boxID,
					gymClassID: gymClassInfo.gymClassID,
					uid: uid
				}
				console.log(data)
				return removeAdminNotification(data)
			})

			Promise.all(promises)
			.then(() => {
				res(true)
			})
			.catch(err => {
				console.log(err)
				rej(err)
			})
		})

	})
}


function getAdminInviteIDs(gymClassInfo){
	return new Promise((res, rej) => {
		fs.collection(ADMIN_NOTIFICATIONS).doc(gymClassInfo.boxID)
		.collection(CLASSES).doc(gymClassInfo.gymClassID)
		.collection(ADMIN_NOTIFICATIONS).where("owner", "==", gymClassInfo.owner)
		.get().then(ss =>{
			console.log(ss)
			let ids = []
			if(!ss.empty){
				ss.forEach(doc => {
					ids.push(doc.data().uid)
				})
				console.log(ids)
				res(ids)
			}
			res(null)
		})
		.catch(err => {
			console.log(err)
			rej(err)
		})
	})
}


const USER_MEMBER_NOTIFICATIONS = "userMemberNotifications"
const MEMBER_NOTIFICATIONS = "memberNotifications"

export function removeMemberNotification(notify){
    return new Promise((res, rej) => {
			fs.collection(USER_MEMBER_NOTIFICATIONS).doc(notify.uid)
			.collection(NOTIFICATIONS).where("uid", "==", notify.uid)
			.get().then(ss => {
				console.log(ss)

				if(!ss.empty){

					ss.forEach(doc => {
						doc.ref.delete()
					})
				}

				fs.collection(MEMBER_NOTIFICATIONS).doc(notify.boxID)
                .collection(CLASSES).doc(notify.gymClassID)
                .collection(MEMBER_NOTIFICATIONS).doc(notify.uid)
                .delete()
				.catch(err => {console.log(err)})
			})
            .then( () => {
                res("Removed notification.")
            })
            .catch(err => {
                console.log(err)
                rej(err)
            })

    })
}


function removeMemberInvitesFromClass(gymClassInfo){
	return new Promise((res, rej) => {
		getMemberInviteIDs(gymClassInfo).then(uids => {
			console.log(uids)
			if(uids == null){
				res(false)
				return
			}
			let promises = uids.map(uid => {
				let data = {
					boxID: gymClassInfo.boxID,
					gymClassID: gymClassInfo.gymClassID,
					uid: uid
				}
				console.log(data)
				return removeMemberNotification(data)
			})

			Promise.all(promises)
			.then(() => {
				res(true)
			})
			.catch(err => {
				console.log(err)
				rej(err)
			})
		})

	})
}



function getMemberInviteIDs(gymClassInfo){
	return new Promise((res, rej) => {
		fs.collection(MEMBER_NOTIFICATIONS).doc(gymClassInfo.boxID)
		.collection(CLASSES).doc(gymClassInfo.gymClassID)
		.collection(MEMBER_NOTIFICATIONS).where("owner", "==", gymClassInfo.owner)
		.get().then(ss =>{
			console.log(ss)
			let ids = []
			if(!ss.empty){
				ss.forEach(doc => {
					ids.push(doc.data().uid)
				})
				console.log(ids)
				res(ids)
			}
			res(null)
		})
		.catch(err => {
			console.log(err)
			rej(err)
		})
	})
}



export function removeGymClass(gymClassInfo){
	return new Promise((resolve, reject) => {
		let deletes = [
			removeAdminInvitesFromClass(gymClassInfo),
			removeMemberInvitesFromClass(gymClassInfo),
			removeAdminsFromClass(gymClassInfo),
			removeMembersFromClass(gymClassInfo),
			deleteClassImage(gymClassInfo.boxID, gymClassInfo.gymClassID),
			new Promise((res, rej) => {
				getWodIDs(gymClassInfo.boxID, gymClassInfo.gymClassID, gymClassInfo.isPrivate)
				.then((ids =>{
					if(!ids){
						res(false)
						return
					}

					let promises = ids.map(id => {
						let wodInfo = {
							boxID: gymClassInfo.boxID,
							gymClassID: gymClassInfo.gymClassID,
							wodID: id,
							isPrivate: gymClassInfo.isPrivate
						}
						return removeWod(wodInfo)
					})

					Promise.all(promises)
					.then(() => {
						console.log(`Deleted wods from class: ${gymClassInfo.gymClassID}`)
						res(`Deleted wods from class: ${gymClassInfo.gymClassID}`)
					})
					.catch(err => {
						console.log(`Error deleteing wods from class: ${gymClassInfo.gymClassID}`)
						rej(err)
					})
				}))
			})
		]

		Promise.all(deletes)
		.then((results) =>{
			console.log(results)
			console.log("DELETING CLASSSSSSSS")
			fs.collection("gymClasses").doc(gymClassInfo.boxID).collection("classes").doc(gymClassInfo.gymClassID)
			.delete()
			.then(() => {
				resolve(`Deleted class: ${gymClassInfo.gymClassID}`)
			})
			.catch(err => {
				console.log(err)
				reject(`Error deleting class: ${gymClassInfo.gymClassID}`)
			})

		})
		.catch(err => {
			console.log("Errorasdlkasndlkasndlknaskldn")
			console.log(err)

		})


	})

}