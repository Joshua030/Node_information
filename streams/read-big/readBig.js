const fs = require("node:fs/promises");

(async () => {
  console.time("readBig");
  const fileHandleRead = await fs.open("text-gigantic.txt", "r");
  const fileHandleWrite = await fs.open("dest.txt", "w");

  const streamRead = fileHandleRead.createReadStream({
    highWaterMark: 64 * 1024,
  });
  const streamWrite = fileHandleWrite.createWriteStream();

  streamRead.on("data", (chunk) => {
    const numbers = chunk.toString("utf-8").split("  ");
    if (!streamWrite.write(chunk)) {
      streamRead.pause();
    }
  });

  streamWrite.on("drain", () => {
    streamRead.resume();
  });
})();
