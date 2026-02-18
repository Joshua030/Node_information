const net = require("net");

const server = net.createServer();

// Store connected clients
const clients = [];

server.on("connection", (socket) => {
  console.log("New client connected");
  const clientId = clients.length + 1;

  clients.map((client) =>
    client.socket.write(`New client connected: ${clientId}`)
  );
  socket.write(`id-${clientId}`);

  socket.on("data", (data) => {
    const dataString = data.toString("utf-8");

    const id = dataString.substring(0, dataString.indexOf("-"));
    const message = dataString.substring(dataString.indexOf("-message-") + 9);
    console.log("Received message from client:", id);
    // Broadcast the message to all connected clients
    clients.forEach((client) => {
      client.socket.write(`Client ${id} says: ${message}`);
    });
  });

  socket.on("end", () => {
    console.log("Client disconnected");
    // Remove the client from the list
    const index = clients.findIndex(
      (client) => client.id === clientId.toString()
    );
    if (index !== -1) {
      clients.splice(index, 1);
    }
    // Notify remaining clients
    clients.forEach((client) =>
      client.socket.write(`Client ${clientId} has disconnected`)
    );
  });

  clients.push({ id: clientId.toString(), socket });
});

server.listen(3008, "127.0.0.1", () => {
  console.log("Server listening on port 3008");
});
