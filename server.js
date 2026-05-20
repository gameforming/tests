const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

const FILE = "./messages.json";

// load messages
function loadMessages() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

// save messages
function saveMessages(messages) {
  fs.writeFileSync(FILE, JSON.stringify(messages, null, 2));
}

let messages = loadMessages();

io.on("connection", (socket) => {

  socket.emit("load_messages", messages);

  // send message
  socket.on("chat_message", (data) => {

    const msg = {
      id: Date.now().toString(),
      name: data.name,
      message: data.message
    };

    messages.push(msg);

    // keep last 1500
    if (messages.length > 1500) {
      messages = messages.slice(-1500);
    }

    saveMessages(messages);

    io.emit("chat_message", msg);
  });

  // delete message
  socket.on("delete_message", (id) => {
    messages = messages.filter(m => m.id !== id);
    saveMessages(messages);

    io.emit("message_deleted", id);
  });

});

server.listen(3000, () => {
  console.log("server running");
});
