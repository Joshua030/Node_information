const net = require('net');

const server = net.createServer()

// Store connected clients
const clients = []

server.on('connection', (socket) => {
  console.log('New client connected');

  socket.on("data", (data) => {
    console.log("Received message from client:", data.toString("utf-8"))
    // Broadcast the message to all connected clients
    clients.forEach((client) => {
      client.write(data)
    })
  })

  clients.push(socket)
})

server.listen(3008, "127.0.0.1", () => {
  console.log('Server listening on port 3008');
});

