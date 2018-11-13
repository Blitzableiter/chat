var app = require("express")();
var express = require("express");
var http = require("http").Server(app);
var io = require("socket.io")(http);
var favicon = require("serve-favicon");

const _port = 8000;

// routing to public folder
app.use("/public", express.static("public"));
// Use provided favicon.ico
app.use(favicon(__dirname + "/favicon.ico"));

// Route to index
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Listen to new connections sent by html
io.on("connection", function(socket) {
  io.emit("new connection");
  // console.log("a user connected");

  // listen to disconnetion sent by html
  socket.on("disconnect", function() {
    io.emit("new disconnection");
    // console.log("user disconnected");
  });

  // listen to chat message sent by html
  socket.on("chat message", function(msg, usr) {
    if (msg.trim() && usr.trim()) io.emit("chat message", msg, usr);
  });
});

// server runs on this port
let port = process.env.PORT;
if (port == null || port == "") port = _port;

app.listen(port);
