import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/firestore";

let fs = firebase.firestore()

const CLASS_MEMBER = "classMembers"
const CLASS_MEMBER_SHALLOW = "classMembersShallow"
const MEMBERS = "members"
const USERS = "users"
const NOTIFICATIONS = "notifications"
const INVITES = "invites"

export default function mTea(){}


export function sendMemberInvite(uid, data){

    let inviteRef = fs.collection(NOTIFICATIONS)
           .doc(MEMBERS)
           .collection(INVITES)



    return new Promise((res, rej) => {
        console.log("isMember")
        isClassMember(uid, data.gymClassID).then(isMember => {
            if(!isMember){
                console.log("isSent")
                isNotificationSent(uid, data.gymClassID)
                .then(isSent => {
                    if(isSent){
                        res("Member notified already.")
                    }else{
                        console.log("Creating notification")
                        let doc = inviteRef.doc()
                        doc.set({ ...data, memberInviteID: doc.id })
                        .then(() => { res("Sent member invite.") })
                        .catch(err => { rej(err) })
                    }
                })
                .catch(err => {
                    rej(err)
                })
            }else{
                res("Already a member.")
            }
        })

    })
}

function isNotificationSent(uid, gymClassID){
    return new Promise((res, rej) => {
        fs.collection(NOTIFICATIONS)
        .doc(MEMBERS)
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

export function getUserMemberInvites(uid){
    return fs.collection(NOTIFICATIONS).doc(MEMBERS)
        .collection(INVITES).where("uid", "==", uid)
}


export function removeNotification(notify){
    return new Promise((res, rej) => {
        fs.collection(NOTIFICATIONS).doc(MEMBERS)
        .collection(INVITES).where("uid", "==", notify.uid).where("gymClassID", "==", notify.gymClassID)
        .get().then(ss => {
            if(!ss.empty){
                ss.docs.forEach(doc => {
                    doc.ref.delete()
                })
            res("Removed notifications.")
            }
            res("No notifications found.")
        })
        .catch(err => { rej(err) })
    })
}





export function getClassMembers(gymClassID){
    return fs.collection(CLASS_MEMBER).where("gymClassID", "==", gymClassID)
}

export function getUserClassMembers(uid){
    return fs.collection(CLASS_MEMBER).where("uid", "==", uid)
}


export function isClassMember (uid, gymClassID){
    return new Promise((res, rej) => {
        fs.collection(CLASS_MEMBER)
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

export function setClassMember(uid, gymClassID, data){
    return new Promise((res, rej) => {
        isClassMember(uid, gymClassID)
        .then(isMember => {
            if(!isMember){
                let doc = fs.collection(CLASS_MEMBER)
                .doc()

                let shallow = fs.collection(CLASS_MEMBER_SHALLOW)
                .doc(data.gymClassID).collection("users").doc(data.uid)

                Promise.all([
                    doc.set({ ...data, classMemberID: doc.id }),
                    shallow.set({uid: data.uid, gymClassID: data.gymClassID, classMemberID: doc.id})
                ])
                .then(result => {
                    res("Added user as a member.")
                })
            }else{
                rej("User is a member.")
            }
        })
        .catch(err => {
            rej(err)
        })
    })
}



export function removeMember(classMember){

    return Promise.all([
        fs.collection(CLASS_MEMBER)
        .doc(classMember.classMemberID)
        .delete(),
        fs.collection(CLASS_MEMBER_SHALLOW).doc(classMember.gymClassID)
        .collection("users").doc(classMember.uid)
        .delete()

    ])
}