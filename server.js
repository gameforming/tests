const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

let messages = [];

io.on("connection", (socket) => {

  socket.emit("load_messages", messages);

  socket.on("chat_message", (data) => {

    messages.push(data);

    if (messages.length > 100) {
      messages.splice(0, messages.length - 100);
    }

    io.emit("chat_message", data);
  });

  // 🗑️ alleen admin mag delete uitvoeren
  socket.on("delete_message", (data) => {
    const { id, isAdmin } = data;

    if (!isAdmin) return; // blokkeren als geen admin

    messages = messages.filter(m => m.id !== id);

    io.emit("message_deleted", id);
  });

});

server.listen(3000, () => {
  console.log("server running");
});
