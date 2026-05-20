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

});

server.listen(3000, () => {
  console.log("server running");
});
