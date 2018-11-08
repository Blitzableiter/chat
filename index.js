var app = require("express")();
var express = require("express");
var http = require("http").Server(app);
var io = require("socket.io")(http);
var favicon = require("serve-favicon");

app.use("/public", express.static("public"));
app.use(favicon(__dirname + "/favicon.ico"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  io.emit("new connection");
  console.log("a user connected");

  socket.on("disconnect", function() {
    io.emit("new disconnection");
    console.log("user disconnected");
  });

  socket.on("chat message", function(msg, usr) {
    if (msg.trim() && usr.trim()) io.emit("chat message", msg, usr);
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
