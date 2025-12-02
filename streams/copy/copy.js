const fs = require("fs/promises");

/*** Algorithm and data structure */
// Speed complexity: O(n), Executing time depends on the size of the file
//Space complexity: O(n), memory used to store the buffer

/** It is good to use this approach for small files */

/* (async () => {
  const destFile = await fs.open("text-copy.txt", "w");
  const result = await fs.readFile("text.txt"); //Is returning a buffer

  await destFile.write(result); //Writing the buffer to the destination file

  console.log(result);
})(); */

/*** In production you need to handle the errors */

/* (async () => {
  console.time("copyFile");
  const srcFile = await fs.open("text.txt", "r");
  const destFile = await fs.open("text-copy.txt", "w");

  let bytesRead = -1;

  while (bytesRead !== 0) {
    const readesult = await srcFile.read(); //Is returning an object with bytesRead and buffer
    bytesRead = readesult.bytesRead; //Number of bytes read
    await destFile.write(readesult.buffer); //Writing only the bytes read to the destination file
  }

  console.timeEnd("copyFile");
})();
 */

// Use pipeline for large files
(async () => {
  console.time("copy");

  const srcFile = await fs.open("text-big.txt", "r");
  const destFile = await fs.open("text-copy.txt", "w");

  const readStream = srcFile.createReadStream();
  const writeStream = destFile.createWriteStream();

  // console.log(readStream.readableFlowing);

  // readStream.pipe(writeStream); Write data from readStream to writeStream

  // console.log(readStream.readableFlowing);

  // readStream.unpipe(writeStream);

  // console.log(readStream.readableFlowing);

  // readStream.pipe(writeStream);

  // console.log(readStream.readableFlowing);

  // readStream.on("end", () => {
  //   console.timeEnd("copy");
  // });

  // Don't use pipe in production, use pipeline instead! It will automatically
  // handle the cleanings for you and give you an easy way for error handling
  pipeline(readStream, writeStream, (err) => {
    console.log(err);
    console.timeEnd("copy");
  });
})();
