//lowest level TCP server using net module
const net = require("net");

const server = net.createServer((socket) => {
  console.log("Client connected");

  socket.on("data", (data) => {
    console.log("Received data from client:", data.toString());
    socket.write(`Echo: ${data}`);
  });

  socket.on("end", () => {
    console.log("Client disconnected");
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

server.listen(3099, "127.0.0.1", () => {
  console.log("Server listening on", server.address());
});
