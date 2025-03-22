const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const os = require("os");

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "*" } });
app.use(cors());

const networkInterfaces = os.networkInterfaces();
let networkIP = "Not found";

for (const iface of Object.values(networkInterfaces)) {
  for (const config of iface) {
    if (config.family === "IPv4" && !config.internal) {
      networkIP = config.address;
      break;
    }
  }
}

console.log(`Network IP: ${networkIP}`);

const users = {};

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("send-location", (data) => {
    users[socket.id] = data;
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("user-disconnected", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
