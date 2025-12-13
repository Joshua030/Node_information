const net = require("net");

const socket = net.createConnection({ port: 3099, host: "127.0.0.1" }, () => {
  console.log("Connected to server");
  socket.write("Hello, server! This is the client.");
});
