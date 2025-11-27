const fs = require("node:fs/promises");

(async () => {
  console.time("readBig");
  const fileHandleRead = await fs.open("text-gigantic.txt", "r");
  const fileHandleWrite = await fs.open("dest.txt", "w");

  const streamRead = fileHandleRead.createReadStream({
    highWaterMark: 64 * 1024,
  });
  const streamWrite = fileHandleWrite.createWriteStream();

  let splitRemainder = "";

  streamRead.on("data", (chunk) => {
    const numbers = chunk.toString("utf-8").split("  ");

    if (Number(numbers[0]) !== Number(numbers[1]) - 1) {
      if (splitRemainder) {
        numbers[0] = splitRemainder.trim() + numbers[0].trim();
        splitRemainder = "";
      }
    }

    if (
      Number(numbers[numbers.length - 2]) + 1 !==
      Number(numbers[numbers.length - 1])
    ) {
      console.error("Data corrupted");
      splitRemainder = numbers.pop();
    }

    numbers.forEach((num) => {
      let n = Number(num.trim());
      if (n % 2 === 0) {
        if (!streamWrite.write(" " + n + " ")) {
          streamRead.pause();
        }
      }
    });
  });

  streamWrite.on("drain", () => {
    streamRead.resume();
  });

  streamRead.on("end", async () => {
    if (splitRemainder) {
      console.error("Data corrupted at the end of the file");
    }
    console.log("Finished reading and writing.");
    console.timeEnd("readBig");
    await fileHandleRead.close();
    await fileHandleWrite.close();
  });
})();
