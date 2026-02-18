const net = require("net");
const fs = require("node:fs/promises");

const server = net.createServer(() => {});

server.on("connection", (socket) => {
  console.log("Client connected");

  let fileHandle; // Declare fileHandle in the outer scope to access it in both 'data' and 'end' event handlers
  let fileStream; // Declare fileStream in the outer scope to access it in both 'data' and 'end' event handlers

  socket.on("data", async (data) => {
    fileHandle = await fs.open(`storage/test.txt`, "w"); // open a file handle for writing to the file "storage/test.txt", It only allows writing to the file, if the file does not exist it will be created, if the file already exists it will be truncated to 0 bytes
    fileStream = fileHandle.createWriteStream(); // create a write stream from the file handle
    fileStream.write(data); // write the data to the file
  });

  socket.on("end", () => {
    console.log("Client disconnected");
    fileHandle.close(); // close the file handle when the client disconnects
  });
});

server.listen(5050, "::1", () => {
  console.log("Uloader server openend on", server.address());
});
