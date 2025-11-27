const fs = require("fs/promises");

// (async () => {
//   console.time("writeMany");
//   for (let i = 0; i < 1000000; i++) {
//     const data = `This is line number ${i}\n`;
//     await fs.appendFile("manyLines.txt", data);
//   }
//   console.timeEnd("writeMany");
// })();

// It takes 33s to run, uses 40%
// (async () => {
//   console.time("writeMany");
//   const fileHandle = await fs.open("test.txt", "w");

//   for (let i = 0; i < 1000000; i++) {
//     await fileHandle.write(` ${i} `);
//   }

//   console.timeEnd("writeMany");
// })();

//* callback version
//const fs = require("fs");
/* (async () => {
  console.time("writeMany");

  fs.open("test.txt", "w", (err, fd) => {
    for (let i = 0; i < 1000000; i++) {
      const buff = Buffer.from(` ${i} `, "utf-8");
      fs.writeSync(fd, buff);
    }

    console.timeEnd("writeMany");
  });
})(); */

//* Stream version
/* //! DONT DO IT THIS WAY IN PRODUCTION CODE
(async () => {
  console.time("writeMany");
  const fileHandle = await fs.open("test.txt", "w");

  const stream = fileHandle.createWriteStream();

  for (let i = 0; i < 1000000; i++) {
    const buff = Buffer.from(` ${i} `, "utf-8//! DONT DO IT THIS WAY IN PRODUCTION CODE
(async () => {
  console.time("writeMany");
  const fileHandle = await fs.open("test.txt", "w");

  const stream = fileHandle.createWriteStream();

  for (let i = 0; i < 1000000; i++) {
    const buff = Buffer.from(` ${i} `, "utf-8");
    stream.write(buff);
  }

  console.timeEnd("writeMany");
})();");
    stream.write(buff);
  }

  console.timeEnd("writeMany");
})(); */

//* Stream version optimized
//! DONT DO IT THIS WAY IN PRODUCTION CODE
(async () => {
  console.time("writeMany");
  const fileHandle = await fs.open("test.txt", "w");

  // 8 bits = 1 byte
  // 1024 bytes = 1 KB
  // 1024 KB = 1 MB
  // 1024 MB = 1 GB
  // 1a -> 0001 1010
  // HighWaterMark -> 64 KB (65536 bytes) by default

  const stream = fileHandle.createWriteStream();

  //   console.log(stream.writableHighWaterMark); // 65536 bytes
  //   console.log(stream.writableLength); // 0 bytes

  //   stream.write("this");
  //   console.log(stream.writableLength); // 4 bytes

  //   const buff = Buffer.alloc(70000); // 70 KB
  //   stream.write(buff);
  //   console.log(stream.writableLength); // 70004 bytes

  //? stream.write() returns false when the internal buffer is full
  //   const canWriteMore = stream.write(buff);
  //   console.log(canWriteMore); // false
  //   console.log(stream.writableLength); // 140004 bytes

  //? Wait for 'drain' event before writing more data
  //   stream.on("drain", () => {
  //     console.log("Drain event emitted, can write more data now.");
  //   });

  let i = 0;
  const writeMany = async () => {
    while (i < 1000000) {
      const buff = Buffer.from(` ${i} `, "utf-8");
      // this is our last write
      if (i === 999999) {
        stream.end(buff); // emit 'finish' event after all data is written
        break;
      }
      if (!stream.write(buff)) break;
      i++;
    }
  };

  writeMany();

  //? Listen for 'drain' event to continue writing
  stream.on("drain", () => {
    writeMany();
  });

  stream.on("finish", () => {
    console.timeEnd("writeMany");
    fileHandle.close();
  });

  //   console.timeEnd("writeMany");
  //fileHandle.close();
})();
