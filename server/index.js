const path = require("path");
const express = require("express");
const app = express(); // create express app
const bodyParser = require('body-parser');
require('dotenv').config();
var http = require('http').createServer(app);

const admin = require('firebase-admin');
var serviceAccount = require("./fbkey.json");

var io = require('socket.io')(http);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '10mb'}))
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static(path.join(__dirname, "../public")));


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    apiKey: "AIzaSyCGE8_j8cfIBmIzcvP6CVgG2yC6EE1Ep1U",
    authDomain: "wodtrackrr.firebaseapp.com",
    databaseURL: "https://wodtrackrr.firebaseio.com",
    projectId: "wodtrackrr",
    storageBucket: "wodtrackrr.appspot.com",
    messagingSenderId: "743601990099",
    appId: "1:743601990099:web:5937e9151eaad13e93a726",
    measurementId: "G-39CF0BRPMH"
  });

var db = admin.database();

// io.on('connection', (socket) => {
//   console.log('a user connected');


// 	socket.on('chat_message', (msg) => {
// 		console.log(msg);
// 	    io.emit('chat_message', msg);
//   });
// });


app.get("/", (req, res) => {
 res.sendFile(path.join(__dirname, "public", "index.html"));
});


// app.post('/verifyCreds', (req, res) => {  
	
// 	admin.auth().verifyIdToken(req.body.idToken).then((claims) => {
// 	  console.log(claims)
// 	  res.json(claims)
// 	});
// })

http.listen(3000, () => {
  console.log('listening on *:3000');
});

