const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./db");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

connectDB();

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("send_message", async (data) => {
    const msg = new Message(data);
    await msg.save();

    io.emit("receive_message", msg);
  });
});

server.listen(5000, () => {
  console.log("Backend running on port 5000");
});
