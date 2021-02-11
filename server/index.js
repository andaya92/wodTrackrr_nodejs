const path = require("path");
const express = require("express");
const app = express(); // create express app
const bodyParser = require('body-parser');
require('dotenv').config();
var http = require('http').createServer(app);

var io = require('socket.io')(http);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '10mb'}))
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static(path.join(__dirname, "../public")));



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

http.listen(3000, () => {
  console.log('listening on *:3000');
});

