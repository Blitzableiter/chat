const pressed = [];
const secretCode = "chat";

window.addEventListener("keyup", e => {
  pressed.push(e.key);
  if (pressed.length > secretCode.length) pressed.shift();
  if (pressed.join("").includes(secretCode)) {
    cornify_add();
  }
});
