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

    const msg = {
      id: Date.now().toString(),
      name: data.name,
      message: data.message
    };

    messages.push(msg);

    if (messages.length > 100) {
      messages = messages.slice(-100);
    }

    io.emit("chat_message", msg);
  });

});

server.listen(3000, () => {
  console.log("server running");
});
