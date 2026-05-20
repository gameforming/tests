// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

let messages = [];

io.on("connection", (socket) => {

  // stuur oude berichten
  socket.emit("load_messages", messages);

  socket.on("chat_message", (data) => {

    messages.push(data);

    // infinite systeem
    if (messages.length > 1500) {
      messages.splice(0, 150);
    }

    io.emit("chat_message", data);
  });

});

server.listen(3000, () => {
  console.log("server running");
});
