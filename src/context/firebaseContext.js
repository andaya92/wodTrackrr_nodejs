import * as firebase from "firebase/app";
import "firebase/auth";
import React from "react";

const firebaseConfig = {
  apiKey: "AIzaSyCGE8_j8cfIBmIzcvP6CVgG2yC6EE1Ep1U",
  authDomain: "wodtrackrr.firebaseapp.com",
  databaseURL: "https://wodtrackrr.firebaseio.com",
  projectId: "wodtrackrr",
  messagingSenderId: "743601990099",
  appId: "1:743601990099:web:5937e9151eaad13e93a726",
  measurementId: "G-39CF0BRPMH",
  storageBucket: "gs://wodtrackrr.appspot.com"
};



export default firebase
export const FirebaseAuthContext = React.createContext(firebase.initializeApp(firebaseConfig));