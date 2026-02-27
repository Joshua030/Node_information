const net = require("net");
const fs = require("node:fs/promises");
const path = require("path");

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

const socket = net.createConnection({ port: 5050, host: "::1" }, async () => {
  const filePath = process.argv[2] || "text.txt";
  const fileName = path.basename(filePath);

  let fileHandle;
  try {
    fileHandle = await fs.open(filePath, "r");
  } catch {
    console.error(`Cannot open file: ${filePath}`);
    socket.destroy();
    return;
  }

  const fileSize = (await fileHandle.stat()).size;
  const fileStream = fileHandle.createReadStream();

  let bytesUploaded = 0;
  let lastPct = -1;

  console.log(`Uploading: ${fileName} (${formatBytes(fileSize)})`);
  socket.write(`filename:${fileName} size:${fileSize}-------`);

  fileStream.on("data", (chunk) => {
    if (!socket.write(chunk)) {
      fileStream.pause(); // pause if socket buffer is full
    }

    bytesUploaded += chunk.length;
    const pct = Math.floor((bytesUploaded / fileSize) * 100);
    if (pct !== lastPct) {
      lastPct = pct;
      process.stdout.write(
        `\r  Progress: ${pct}% (${formatBytes(bytesUploaded)} / ${formatBytes(fileSize)})   `
      );
    }
  });

  socket.on("drain", () => fileStream.resume()); // resume when socket buffer drains

  fileStream.on("end", () => {
    process.stdout.write("\n");
    console.log("Transfer complete. Waiting for server confirmation...");
    socket.end(); // half-close: no more data from client, but server can still reply
  });

  fileStream.on("error", (err) => {
    console.error(`\nRead error: ${err.message}`);
    socket.destroy();
  });
});

socket.on("data", (data) => {
  if (data.toString().trim() === "OK") {
    console.log("Server confirmed: file saved successfully.");
  }
});

socket.on("error", (err) => {
  console.error(`Connection error: ${err.message}`);
});

socket.on("close", () => {
  console.log("Done.");
});
