// Include the Writable stream module
const { Writable } = require("stream");
const fs = require("node:fs");

// Create a custom writable stream
class CustomWritable extends Writable {
  // Define the constructor to accept highWaterMark and fileName
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });
    this.fileName = fileName;
    this.fd = null; // File descriptor will be set in _construct
    this.chunks = [];
    this.chunkSize = 0;
    this.numWrites = 0;
  }

  // Implement the _construct method
  _construct(callback) {
    // Perform any setup or initialization here
    console.log(`Constructing writable stream for ${this.fileName}`);

    // Open the file for writing
    fs.open(this.fileName, "w", (err, fd) => {
      if (err) {
        return callback(err);
      }
      this.fd = fd;
      callback();
    });
  }

  // Implement the _write method  callback();
  _write(chunk, encoding, callback) {
    // Simulate writing data to a file (for demonstration purposes)
    console.log(`Writing chunk to ${this.fileName}:`, chunk.toString());
    console.log(this.fd, "file descriptor");

    // Store the chunk and its size
    this.chunks.push(chunk);
    this.chunkSize += chunk.length;

    // If the accumulated chunk size exceeds a threshold, write to file
    if (this.chunkSize > this.writableHighWaterMark) {
      const buffer = Buffer.concat(this.chunks, this.chunkSize);
      fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
        if (err) {
          return callback(err);
        }
        // Reset chunks and size after writing
        this.chunks = [];
        this.chunkSize = 0;
        this.numWrites++;
        callback();
      });
    } else {
      // Call the callback to indicate that the write is complete
      callback();
    }
  }

  // Implement the _final method
  _final(callback) {
    if (this.chunkSize > 0) {
      const buffer = Buffer.concat(this.chunks, this.chunkSize);
      fs.write(this.fd, buffer, (err) => {
        if (err) {
          return callback(err);
        }
        this.chunks = [];
        this.chunkSize = 0;
        this.numWrites++;
        callback();
      });
    } else {
      callback();
    }
  }

  // Implement the _destroy method

  _destroy(err, callback) {
    console.log(this.numWrites, "total writes to file");
    if (this.fd) {
      fs.close(this.fd, (closeErr) => {
        callback(closeErr || err);
      });
    } else {
      callback(err);
    }
  }
}

// Create an instance of the custom writable stream
const stream = new CustomWritable({
  highWaterMark: 1800,
  fileName: "output.txt",
});

// Write data to the custom writable stream
stream.write("Some data to write to the custom writable stream.");
stream.end(Buffer.from("Final data chunk."));

// Listen for the 'finish' event to know when all data has been written
stream.on("drain", () => {
  console.log("Stream drained, ready for more data.");
});

/// Listen for the 'finish' event to know when all data has been written
stream.on("finish", () => {
  console.log("All data has been written to the custom writable stream.");
});

// Listen for the 'error' event to handle any errors
stream.on("error", (err) => {
  console.error("Error occurred in custom writable stream:", err);
});
