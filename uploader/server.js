const net = require("net");
const fs = require("node:fs/promises");
const path = require("path");

const STORAGE_DIR = "storage";

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

async function main() {
  await fs.mkdir(STORAGE_DIR, { recursive: true }); // ensure storage dir exists

  const server = net.createServer();

  server.on("connection", (socket) => {
    const clientAddr = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`Client connected: ${clientAddr}`);

    let fileHandle = null;
    let fileStream = null;
    let bytesReceived = 0;
    let fileSize = 0;
    let fileName = "";

    function showProgress() {
      if (!fileSize) return;
      const pct = Math.floor((bytesReceived / fileSize) * 100);
      process.stdout.write(
        `\r  Receiving: ${pct}% (${formatBytes(bytesReceived)} / ${formatBytes(fileSize)})   `
      );
    }

    socket.on("data", async (data) => {
      if (!fileHandle) {
        socket.pause(); // pause while setting up the write stream

        const dividerIndex = data.indexOf("-------");
        if (dividerIndex === -1) {
          console.error("Invalid upload header: missing divider");
          socket.destroy();
          return;
        }

        const header = data.slice(0, dividerIndex).toString();
        const nameMatch = header.match(/filename:(\S+)/);
        const sizeMatch = header.match(/size:(\d+)/);

        if (!nameMatch) {
          console.error("Invalid upload header: missing filename");
          socket.destroy();
          return;
        }

        fileName = path.basename(nameMatch[1]); // basename prevents path traversal
        fileSize = sizeMatch ? parseInt(sizeMatch[1], 10) : 0;

        const filePath = path.join(STORAGE_DIR, fileName);
        try {
          fileHandle = await fs.open(filePath, "w");
        } catch (err) {
          console.error(`Cannot create file: ${err.message}`);
          socket.destroy();
          return;
        }

        fileStream = fileHandle.createWriteStream();
        fileStream.on("error", (err) => {
          console.error(`Write error: ${err.message}`);
          socket.destroy();
        });
        fileStream.on("drain", () => socket.resume()); // resume socket when write buffer drains

        console.log(`\nReceiving: ${fileName}${fileSize ? ` (${formatBytes(fileSize)})` : ""}`);

        const payload = data.slice(dividerIndex + 7); // data after the header divider
        if (payload.length > 0) {
          bytesReceived += payload.length;
          showProgress();
          if (!fileStream.write(payload)) {
            // socket stays paused; fileStream drain event will resume it
          } else {
            socket.resume();
          }
        } else {
          socket.resume();
        }
      } else {
        bytesReceived += data.length;
        showProgress();
        if (!fileStream.write(data)) {
          socket.pause(); // pause socket if write stream buffer is full
        }
      }
    });

    socket.on("end", () => {
      if (!fileHandle) return;
      fileStream.end(() => {        // flush write stream before closing
        fileHandle.close().then(() => {
          if (fileSize) process.stdout.write("\n");
          console.log(`Saved: ${fileName} (${formatBytes(bytesReceived)})`);
          socket.write("OK"); // acknowledge to client
          socket.end();
          fileHandle = null;
          fileStream = null;
        }).catch((err) => {
          console.error(`Error closing file: ${err.message}`);
          socket.destroy();
        });
      });
    });

    socket.on("error", (err) => {
      console.error(`Socket error [${clientAddr}]: ${err.message}`);
      if (fileHandle) {
        fileHandle.close().catch(() => {});
        fileHandle = null;
        fileStream = null;
      }
    });

    socket.on("close", () => {
      console.log(`Client disconnected: ${clientAddr}`);
    });
  });

  server.listen(5050, "::1", () => {
    console.log("Uploader server listening on", server.address());
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
