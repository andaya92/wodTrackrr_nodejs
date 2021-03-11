import firebase from "../../context/firebaseContext"
import "firebase/firestore"

import { setBox } from "./boxes.js"
import { setClassAdmin} from "./classAdmin.js"
import { setClassMember } from "./classMember"
import { setFollow } from "./follows"
import { setGymClass } from "./gymClass"
import { setScore } from "./scores"
import {setWod } from "./wods"


let fs = firebase.firestore()
const uid = "7yT7qYHwXvNySI0DVb71PeOTvQl1"
const uidA = "w4H00HnAr3VZ6gfDl9atBTu6NN83"
const boxTitle = "Test Box"
const classTitle = "Test Class"

export default function mTea(){}

export function createTestData(){
    setBox(boxTitle, uid).then(boxID =>{
        setFollow(uid, "Owner1", boxID, boxTitle)
        setGymClass(classTitle, uid, boxID, boxTitle, true).then(gymClassID => {


            console.log("Waiting...")
            new Promise(resolve => setTimeout(resolve, 5000)).then(() => {
                console.log("Waited 5 seconds")
                let data = {uid: uid, gymClassID: gymClassID}
                setClassMember(uid, gymClassID, data)
                setClassAdmin(uid, gymClassID, data)

                let dataA = {uid: uidA, gymClassID: gymClassID}
                setClassMember(uidA, gymClassID, dataA)
                setClassAdmin(uidA, gymClassID, dataA)

                setWod(data).then( wodID => {
                    setScore(classTitle, "Owner1", uid, 13, wodID, gymClassID, boxID, "reps")
                })


            })

        })
    })
}