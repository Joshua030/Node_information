const fs = require("fs/promises");

(async () => {
  const commandFileHandler = await fs.open("./command.txt", "r");

  commandFileHandler.on("change", async (err) => {
    //Get the size of the file
    const { size } = await commandFileHandler.stat();
    //allocate a buffer with the size of the file
    const buff = Buffer.alloc(size);
    //location at which we want to start filling the buffer
    const offset = 0;
    //number of bytes to read
    const length = buff.byteLength;
    //position from where to start reading the file
    const position = 0;
    //we always want to read the whole content
    await commandFileHandler.read(buff, offset, length, position);

    //decode 01 => meaningful content
    //encoder meaningful content => 01

    console.log(buff.toString("utf-8"));
  });

  // watcher...
  const watcher = await fs.watch("./command.txt");

  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
