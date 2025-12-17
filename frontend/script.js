const socket = io("http://localhost:5000");

function sendMessage() {
  const user = document.getElementById("username").value;
  const text = document.getElementById("message").value;

  if (!user || !text) return;

  socket.emit("send_message", {
    sender: user,
    content: text
  });

  document.getElementById("message").value = "";
}

socket.on("receive_message", (msg) => {
  const div = document.createElement("div");
  div.className = "msg";
  div.innerText = msg.sender + ": " + msg.content;

  document.getElementById("messages").appendChild(div);
});
