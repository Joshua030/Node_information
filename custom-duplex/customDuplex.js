// Duplex Stream implementation in Node.js
const { Duplex } = require("stream");
const fs = require("node:fs");

class CustomDuplex extends Duplex {
  constructor({
    writableHighWaterMark,
    readableHighWaterMark,
    readFileName,
    writeFileName,
  }) {
    super({ writableHighWaterMark, readableHighWaterMark });
    this.readFileName = readFileName;
    this.writeFileName = writeFileName;
    this.readFd = null; // file descriptor
    this.writeFd = null; // file descriptor
    this.chunkSize = 0; // size of each chunk to read
    this.chunks = []; // array to hold chunks read from file
  }

  _construct(callback) {
    fs.open(this.readFileName, "r", (err, fd) => {
      if (err) return callback(err);
      this.readFd = fd;
      fs.open(this.writeFileName, "w", (err, fd) => {
        if (err) return callback(err);
        this.writeFd = fd;
        callback();
      });
    });
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunkSize += chunk.length;

    if (this.chunkSize > this.writableHighWaterMark) {
      fs.write(
        this.writeFd,
        Buffer.concat(this.chunks, this.chunkSize),
        (err) => {
          if (err) return callback(err);
          this.chunks = [];
          this.chunkSize = 0;
          callback();
        }
      );
    } else {
      callback();
    }
  }
  _read(size) {
    const buffer = Buffer.alloc(size);
    fs.read(this.readFd, buffer, 0, size, null, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
        return;
      }
      if (bytesRead === 0) {
        this.push(null); // No more data
      } else {
        this.push(buffer.slice(0, bytesRead));
      }
    });
  }

  _final(callback) {
    if (this.chunkSize > 0) {
      fs.write(
        this.writeFd,
        Buffer.concat(this.chunks, this.chunkSize),
        (err) => {
          if (err) return callback(err);
          this.chunks = [];
          this.chunkSize = 0;
          callback();
        }
      );
    } else {
      callback();
    }
  }

  _destroy(err, callback) {
    fs.close(this.readFd, (readErr) => {
      fs.close(this.writeFd, (writeErr) => {
        callback(err || readErr || writeErr);
      });
    });
  }
}
