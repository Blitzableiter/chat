// Socket for client/server interaction
let socket = io();

// Grabbing relevant elements from DOM
const username = document.getElementById("username");
const inputForm = document.getElementById("inputForm");

/**
 * @function
 * @name setInnerHTMLId
 * @description set element with _id's innerHTML to given _innerHTML
 * @param {String} _id elementById to be set
 * @param {Strng} _innerHTML value the given element is to be set to
 */
function setInnerHTMLId(_id, _innerHTML) {
  if (document.getElementById(_id)) {
    document.getElementById(_id).innerHTML = _innerHTML;
  }
}

/**
 * @function
 * @name userNameChange
 * @description Handling change of username input field
 * @description Username has to be at least non-blank character to be accepted
 */
function userNameChange() {
  if (!document.getElementById("username").value.trim()) {
    setInnerHTMLId("usernameErr", "Gimme dat sweet sweet name");
  } else {
    setInnerHTMLId("usernameErr", "");
  }
}

/**
 * @function
 * @name sendMessage
 * @description Sending Chat message to server
 * @param {event} e submit-event on input form
 */
function sendMessage(e) {
  e.preventDefault();
  const _username = document.getElementById("username").value.trim();
  const _message = document.getElementById("m").value.trim();
  if (_username && _message) {
    socket.emit("chat message", _message, _username);
    // Delete input message when transferal to socket was done
    this.reset();
  }
}

/**
 * @function
 * @name addMessageToMessages
 * @description Adds a message (<li>) to the top of the messages on screen
 * @param {String} message message to be added to the list of messages
 */
function addMessageToMessages(message) {
  const currentMessages = document.getElementById("messages").innerHTML;
  document.getElementById("messages").innerHTML = message + currentMessages;
}

/**
 * @function
 * @name hashCode
 * @description Convert a string into a six digit hex value
 * @param {String} str String to be converted
 * @returns {String} converted hex value
 */
function hashCode(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

/**
 * @function
 * @name intToRGB
 * @description Convert an integer into corresponding hex value
 * @param {integer} i integer to be converted
 * @returns {string} converted hex value
 */
function intToRGB(i) {
  var c = (i & 0x00ffffff).toString(16).toUpperCase();
  return "00000".substring(0, 6 - c.length) + c;
}

/**
 * @function
 * @name invertColor
 * @description Inverts a hex value to represent the complementary color
 * @param {string} hex hex value to be inverted
 * @returns {string} hexcode of the inverted color, no leading #
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
 * @function
 * @name padZero
 * @description Pad a given string with leading zeros. If no length is specified, assume length to be 2
 * @param {string} str
 * @param {integer} len
 */
function padZero(str, len = 2) {
  var zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
}

//// Socket-Listeners
// Receiving Chat-Message from server
socket.on("chat message", function(msg, usr) {
  const date = new Date().toLocaleDateString();
  const bgcolor = intToRGB(hashCode(usr));
  const textcolor = invertColor(bgcolor);
  const inlineStyling = `background: #${bgcolor}; color: #${textcolor};`;
  const newMsg = `
  <li style="${inlineStyling}">
    ${usr} (${date}): ${msg}
  </li>
  `;
  addMessageToMessages(newMsg);
});

// New chat-window was opened: Send message to chat
socket.on("new connection", function(socket) {
  const date = new Date().toLocaleDateString();
  const newMsg = `
  <li class="liMessage">
  ${date}: Somebody joined. Ew.
  </li>
  `;
  addMessageToMessages(newMsg);
});

// A chat-window was closed: Send message to chat
socket.on("new disconnection", function(socket) {
  const date = new Date().toLocaleDateString();
  const newMsg = `
  <li class="liMessage">
  ${date}: Somebody left. Finally there is some peace...
  </li>
  `;
  addMessageToMessages(newMsg);
});

// Verifying changed Username: Not empty, not only spaces
username.addEventListener("change", userNameChange);
inputForm.addEventListener("submit", sendMessage);
