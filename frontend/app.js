const socket = io("http://localhost:5000");

const USER_ID = "U1"; // demo user
const TARGET_ID = "U2"; // demo receiver

socket.emit("join", USER_ID);

socket.on("receive_message", (msg) => {
  const li = document.createElement("li");
  li.innerText = msg.content + " (" + msg.status + ")";
  document.getElementById("chat").appendChild(li);
});

function send() {
  const text = document.getElementById("msg").value;

  socket.emit("send_message", {
    senderId: USER_ID,
    targetId: TARGET_ID,
    isGroup: false,
    content: text
  });

  document.getElementById("msg").value = "";
}
