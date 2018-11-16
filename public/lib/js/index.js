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
 * @description Adds an HTMLElement to the top of the messages on screen
 * @param {HTMLElement} message HTMLElement to be prepended to the list of messages
 */
function addMessageToMessages(message) {
  document.getElementById("messages").prepend(message);
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
/**
 * @function
 * @name escapeHtml
 * @description Escapes HTML-tags so they aren't processed by the DOM
 * @param {string} text HTML-text to be escaped
 * @returns {string} text escaped HTML-text
 */
function escapeHtml(text) {
  return (
    text
      // .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  );
}

function createAnchor(href, text) {
  var anchor = document.createElement("a");
  anchor.target = "_blank";
  anchor.rel = "external";
  anchor.href = href;
  anchor.innerHTML = text || href;
  return anchor;
}

//// Socket-Listeners
// Receiving Chat-Message from server
socket.on("chat message", function(msg, usr) {
  const date = new Date().toLocaleTimeString();
  const bgcolor = intToRGB(hashCode(usr));
  const textcolor = invertColor(bgcolor);
  const inlineStyling = `background: #${bgcolor}; color: #${textcolor};`;

  // Escape signs so they aren't interpreted by the DOM
  msg = escapeHtml(msg);

  // const regex = /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  const regex = /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \?\=\&\;\.-]*)*\/?/;

  // initialize anchors for scope reasons
  var anchors = [];

  // Message contains URLs that are to be transformed into an anchor
  if (msg.match(regex)) {
    var [...possibleAnchors] = regex.exec(msg)[0].split(" "); // spread words (including URLs) into array
    for (i = 0; i < possibleAnchors.length; i++) {
      if (!possibleAnchors[i].match(regex)) possibleAnchors.splice(i, 1); // eliminate non-URL elements in array
    }
    // returns an array of only anchor-HTML-elements
    anchors = possibleAnchors.map(item => {
      // item = createAnchor(item); // make the URL into an anchor-HTML-elements
      // console.log(item);
      msg.replace(item, createAnchor(item));
      return item;
    });
  }

  console.log(msg);
  // console.table(msg);

  // msg = msg.replace(regex);

  // var nth = 0;
  // for (ind = 1; ind <= anchors.length; ind++) {
  //   msg = msg.replace(regex, function(match, i, original) {
  //     nth++;
  //     console.log(nth, ind);
  //     return nth === ind ? anchors[ind - 1] : match;
  //   });
  // }

  var newMsg = document.createElement("li");
  newMsg.style = inlineStyling;
  newMsg.innerHTML = `${usr} (${date}): ${msg}`;
  console.log(newMsg);

  addMessageToMessages(newMsg);
});

// New chat-window was opened: Send message to chat
socket.on("new connection", function(socket) {
  const date = new Date().toLocaleTimeString();
  var newMsg = document.createElement("li");
  newMsg.innerHTML = `${date}: Somebody joined. Ew.`;
  addMessageToMessages(newMsg);
});

// A chat-window was closed: Send message to chat
socket.on("new disconnection", function(socket) {
  const date = new Date().toLocaleTimeString();
  var newMsg = document.createElement("li");
  newMsg.innerHTML = `${date}: Somebody left. Finally there is some peace...`;
  addMessageToMessages(newMsg);
});

// Verifying changed Username: Not empty, not only spaces
username.addEventListener("change", userNameChange);
inputForm.addEventListener("submit", sendMessage);
