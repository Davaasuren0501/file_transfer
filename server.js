const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname+"/public")));

io.on("connection", function(socket){
	socket.on("sender-join",function(data){
		socket.join(data.uid);
	});
	socket.on("receiver-join",function(data){
		socket.join(data.uid);
		socket.in(data.sender_uid).emit("init", data.uid);
	});
	socket.on("file-meta",function(data){
		socket.in(data.uid).emit("fs-meta", data.metadata);
	});
	socket.on("fs-start",function(data){
		socket.in(data.uid).emit("fs-share", {});
	});
	socket.on("file-raw",function(data){
		socket.in(data.uid).emit("fs-share", data.buffer);
	})
	socket.on("newuser", function (username) {
		socket.broadcast.emit("update", username + " joined the conversation");
	});
	socket.on("exituser", function (username) {
		socket.broadcast.emit("update", username + " left the conversation");
	});
	socket.on("chat", function (message) {
		socket.broadcast.emit("chat", message);
	});
});

server.listen(5000);