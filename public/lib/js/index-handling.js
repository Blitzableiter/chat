$(function() {
  var socket = io();
  $("#username").change(function() {
    if (
      $("#username")
        .val()
        .trim()
    ) {
      $("#usernameErr").text("");
    } else {
      $("#usernameErr").text("Gimme dat sweet sweet name");
    }
  });
  $("form").submit(function() {
    socket.emit("chat message", $("#m").val(), $("#username").val());
    $("#m").val("");
    return false;
  });
  socket.on("chat message", function(msg, usr) {
    var date = new Date();
    $("#messages").prepend(
      $("<li>").text(usr + " (" + date.toLocaleTimeString() + "): " + msg)
    );
  });
  socket.on("new connection", function(socket) {
    var date = new Date();
    $("#messages").prepend(
      $("<li class='liMessage'>").text(
        date.toLocaleTimeString() + ": Somebody joined. Ew."
      )
    );
  });
  socket.on("new disconnection", function(socket) {
    var date = new Date();
    $("#messages").prepend(
      $("<li class='liMessage'>").text(
        date.toLocaleTimeString() +
          ": Somebody left. Finally there is some peace..."
      )
    );
  });
});
