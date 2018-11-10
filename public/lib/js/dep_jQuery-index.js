$(function() {
  var socket = io();

  // Verifying changed Username: Not empty, not only spaces
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

  // Submit: Sending Chat message to server
  $("form").submit(function() {
    socket.emit("chat message", $("#m").val(), $("#username").val());
    if ($("#username").val()) $("#m").val("");
    return false;
  });

  // Receiving Chat-Message from server
  socket.on("chat message", function(msg, usr) {
    var date = new Date();
    var bgcolor = intToRGB(hashCode(usr));
    var textcolor = invertColor(bgcolor);
    var inlineStyling =
      "background: #" + bgcolor + "; color: " + textcolor + ";";
    $("#messages").prepend(
      $("<li style='" + inlineStyling + "'>").text(
        usr + " (" + date.toLocaleTimeString() + "): " + msg
      )
    );
  });

  // New chat-window was opened: Send message to chat
  socket.on("new connection", function(socket) {
    var date = new Date();
    $("#messages").prepend(
      $("<li class='liMessage'>").text(
        date.toLocaleTimeString() + ": Somebody joined. Ew."
      )
    );
  });

  // A chat-window was closed: Send message to chat
  socket.on("new disconnection", function(socket) {
    var date = new Date();
    $("#messages").prepend(
      $("<li class='liMessage'>").text(
        date.toLocaleTimeString() +
          ": Somebody left. Finally there is some peace..."
      )
    );
  });

  /**
   * hashCode: Transform a string into a six digit hex value
   * @param {String} str
   */
  function hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  /**
   * intToRGB: Transform an integer into corresponding hex value
   * @param {integer} i
   */
  function intToRGB(i) {
    var c = (i & 0x00ffffff).toString(16).toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
  }

  /**
   * invertColor: Inverts a hex value to represent the complementary color
   * @param {string} hex: hex value to be inverted
   */
  function invertColor(hex) {
    if (hex.indexOf("#") === 0) {
      hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      throw new Error("Invalid HEX color.");
    }
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
      g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
      b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return "" + padZero(r) + padZero(g) + padZero(b);
  }

  /**
   * padZero: Pad a given string with leading zeros. If no length is specified, assume length to be 2
   * @param {string} str
   * @param {integer} len
   */
  function padZero(str, len = 2) {
    var zeros = new Array(len).join("0");
    return (zeros + str).slice(-len);
  }
});
