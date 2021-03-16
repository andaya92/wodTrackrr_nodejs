import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/firestore";

let fs = firebase.firestore()

const CLASS_MEMBER = "classMembers"
const USER_CLASS_MEMBER = "userClassMembers"
const MEMBERS = "members"
const MEMBER_NOTIFICATIONS = "memberNotifications"
const USER_NOTIFICATIONS = "userMemberNotifications"
const USERS = "users"
const NOTIFICATIONS = "notifications"
const INVITES = "invites"
const CLASSES = "classes"


export default function mTea(){}



export function sendMemberInvite(uid, gymClassMD, sender, senderUsername){


    let inviteRef = fs.collection(MEMBER_NOTIFICATIONS).doc(gymClassMD.boxID)
    .collection(CLASSES).doc(gymClassMD.gymClassID)
    .collection(MEMBER_NOTIFICATIONS)

    let userInviteRef = fs.collection(USER_NOTIFICATIONS).doc(uid)
    .collection(NOTIFICATIONS).doc()




    let data = {
        uid: uid,
        sender: sender,
        senderUsername: senderUsername,
        owner: gymClassMD.owner,
        boxID: gymClassMD.boxID,
        gymClassID: gymClassMD.gymClassID,
        boxTitle: gymClassMD.boxTitle,
        gymClassTitle: gymClassMD.title,
        date: Date.now()
    }

    return new Promise((res, rej) => {
        console.log("idAdmin?")
        isClassMember(uid, gymClassMD.boxID, gymClassMD.gymClassID).then(isAdmin => {
            if(!isAdmin){
                console.log("isSent?")
                isNotificationSent(uid, gymClassMD.boxID, gymClassMD.gymClassID)
                .then(isSent => {
                    if(isSent){
                        res("Admin notified already.")
                    }else{

                        console.log("Setting adminf notify data")

                        Promise.all([
                            userInviteRef.set({ ...data, notifyID: userInviteRef.id }),
                            inviteRef.doc(uid).set(data)
                        ])
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

function isNotificationSent(uid, boxID, gymClassID){
    /* Checks if notifications has been sent to the user for a class invite.

    Queries "notifications/admins/invites/" for uid and gymClassID.
    Returns true if found, otherwise false

    Args:
        uid A string autogenerated for the user.
        gymClassID A string autogenerated for the document.
     */
    return new Promise((res, rej) => {
        console.log("isSent: start")
        fs.collection(MEMBER_NOTIFICATIONS).doc(boxID)
        .collection(CLASSES).doc(gymClassID)
        .collection(MEMBER_NOTIFICATIONS).doc(uid)
        .get().then(ss => {
            console.log("isSent: snapshot")
            console.log(ss)
            res(ss.exists)
        },
        err => { rej(err) })
    })
}

export function getUserMemberInvites(uid) {
    // go through boxes and classes to find all invites.
    return fs.collection(USER_NOTIFICATIONS).doc(uid)
    .collection(NOTIFICATIONS)
}


export function removeNotification(notify){
    return new Promise((res, rej) => {
            res("No notifications found.")
            Promise.all([
                fs.collection(MEMBER_NOTIFICATIONS).doc(notify.boxID)
                .collection(CLASSES).doc(notify.gymClassID)
                .collection(MEMBER_NOTIFICATIONS).doc(notify.uid)
                .delete(),

                fs.collection(USER_NOTIFICATIONS).doc(notify.uid)
                .collection(NOTIFICATIONS).doc(notify.notifyID).delete()

            ])
            .then( () => {
                res("Removed notification.")
            })
            .catch(err => {
                rej(err)
            })

    })
}



export function getClassMembers(boxID, gymClassID){
    return fs.collection(CLASS_MEMBER).doc(boxID)
    .collection(CLASSES).doc(gymClassID)
    .collection(MEMBERS)

}

export function getUserClassMembers(uid){
    // Need to proccess
    return fs.collection(USER_CLASS_MEMBER).doc(uid)
    .collection("classes").where("uid", "==", uid)



}

export function isClassMember (uid, boxID, gymClassID){
    return new Promise((res, rej) => {
        fs.collection(CLASS_MEMBER).doc(boxID)
        .collection(CLASSES).doc(gymClassID)
        .collection(MEMBERS).doc(uid)
        .get()
        .then(adminSS => {
            console.log(adminSS)
            if(adminSS.exists){
                res(true)
            }else{
                res(false)
            }
        })
        .catch(err => {
            rej(err)
        })
    })
}

export function setClassMember(uid, boxID, gymClassID, owner, username, boxTitle, classTitle){
    return new Promise((res, rej) => {
        isClassMember(uid, boxID, gymClassID)
        .then(isMember => {
            if(!isMember){
                let data = {
                    uid: uid,
                    boxID: boxID,
                    gymClassID: gymClassID,
                    owner: owner,
                    username: username,
                    boxTitle: boxTitle,
                    classTitle: classTitle,
                    date: Date.now()
                }

                let doc = fs.collection(CLASS_MEMBER).doc(boxID)
                .collection(CLASSES).doc(gymClassID)
                .collection(MEMBERS).doc(uid)

                let shallow = fs.collection(USER_CLASS_MEMBER).doc(uid)
                .collection(CLASSES).doc(gymClassID)



                Promise.all([
                    doc.set({ ...data, classAdminID: doc.id }),
                    shallow.set({...data, classAdminID: doc.id})
                ])
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


export function removeMember({boxID, gymClassID, uid}){

    return Promise.all([
        fs.collection(CLASS_MEMBER).doc(boxID)
        .collection(CLASSES).doc(gymClassID)
        .collection(MEMBERS).doc(uid).delete(),

        fs.collection(USER_CLASS_MEMBER).doc(uid)
        .collection(CLASSES).doc(gymClassID).delete()
    ])
}

