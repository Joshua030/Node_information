const net = require("net");
const fs = require("node:fs/promises");

const socket = net.createConnection({ port: 5050, host: "::1" }, async () => {
  const filePath = "text.txt";
  const fileHandle = await fs.open(filePath, "r");
  const fileStream = fileHandle.createReadStream();

  // Pipe the file stream to the socket
  fileStream.on("data", (chunk) => {
    socket.write(chunk);
  });

  fileStream.on("end", () => {
    console.log("File sent successfully");
    socket.end(); // Close the socket after sending the file
  });
});
