import firebase from "../../context/firebaseContext"
import "firebase/auth"; 
import "firebase/firestore";

let fs = firebase.firestore()

const CLASS_ADMIN = "classAdmins"
const ADMINS = "admins"
const USERS = "users"
const NOTIFICATIONS = "notifications"
const INVITES = "invites"



export default function mTea(){}



export function sendAdminInvite(uid, data){
    
    let inviteRef = fs.collection(NOTIFICATIONS)
           .doc(ADMINS)
           .collection(INVITES)
           

    
    return new Promise((res, rej) => {
        isClassAdmin(uid, data.gymClassID).then(isAdmin => {
            if(!isAdmin){
                isNotificationSent(uid, data.gymClassID)
                .then(isSent => {
                    if(isSent){
                        res("Admin notified already.")
                    }else{
                        let doc = inviteRef.doc()
                        doc.set({ ...data, adminInviteID: doc.id })
                        .then(() => { res("Sent admin invite.") })
                        .catch(err => { rej(err) })
                    }
                })
                .catch(err => {
                    rej(err)
                })
            }else{
                res("Already an admin.")
            }
        })

    }) 
}

function isNotificationSent(uid, gymClassID){
    return new Promise((res, rej) => {
        fs.collection(NOTIFICATIONS)
        .doc(ADMINS)
        .collection(INVITES)
        .where("uid", "==", uid)
        .where("gymClassID", "==", gymClassID)
        .get().then(ss => {
            console.log(uid, gymClassID)
            console.log(ss.docs)
            if(ss.empty){
                res(false)
            }else{
                res(true)
            }
        },
        err => { rej(err) })
    })
}

export function getUserAdminInvites(uid){
    return fs.collection(NOTIFICATIONS).doc(ADMINS)
        .collection(INVITES).where("uid", "==", uid)
}


export function removeNotification(notifyID){
    return new Promise((res, rej) => {
        fs.collection(NOTIFICATIONS).doc(ADMINS)
        .collection(INVITES).where("adminInviteID", "==", notifyID)
        .get().then(ss => {
            if(!ss.empty){
                ss.docs.forEach(doc => {
                    doc.ref.delete()
                })
            res("Removed notifications.")
            }
            res("No notifications found.")
        },
        err => { rej(err) })
    })
}



export function getClassAdmins(gymClassID){
    return fs.collection(CLASS_ADMIN)
    .where("gymClassID", "==", gymClassID)
}

export function getUserClassAdmins(uid){
    return fs.collection(CLASS_ADMIN)
    .where("uid", "==", uid)
}

export function isClassAdmin (uid, gymClassID){
    return new Promise((res, rej) => {
        fs.collection(CLASS_ADMIN)
        .where("gymClassID", "==", gymClassID)
        .get().then(classSS => {
            console.log(classSS)
            if(!classSS.empty){
                classSS.forEach(classDoc => {
                    if(classDoc.data().uid == uid){
                        res(true)
                    }
                })
            }
            res(false)
        },
        err => {
            rej(err)
        })
    })
}

export function setClassAdmin(uid, gymClassID, data){
    return new Promise((res, rej) => {
        isClassAdmin(uid, gymClassID)
        .then(isMember => {
            if(!isMember){
                let doc = fs.collection(CLASS_ADMIN).doc()
                
                doc.set({ ...data, classAdminID: doc.id })
                .then( () => {
                    res("Added user as an admin.")
                })
                .catch(err => { rej(err) })
            }else{
                res("User is an admin.")
            }
        })
        .catch(err => {
            rej(err)
        })
    })
}

export function removeAdmin(classAdminID){
    return fs.collection(CLASS_ADMIN)
    .doc(classAdminID)
    .delete()
}