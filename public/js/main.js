const chatForm = document.getElementById("chat-form");
const chatMSG = document.querySelector(".chat-messages");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

console.log(username, room);

const socket = io();

socket.emit("joinRoom", {username, room});


//catching the event from the server
socket.on("message", (message) => {
  outputMSG(message); 

  //auto-scroll down
  chatMSG.scrollTop = chatMSG.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit("chatMSG", {username,msg,room});
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outputMSG(message) {
  const div = document.createElement("div");

  div.classList.add("message");
  div.innerHTML = `<p class="meta">
  ${message.username} <span>
  ${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;

  document.querySelector(".chat-messages").append(div);
}
