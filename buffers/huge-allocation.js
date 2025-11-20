const { Buffer, constants } = require("buffer");

const b = Buffer.alloc(1e9); //  1.000.000.000 bytes (1GB)

console.log(constants.MAX_LENGTH); // maximum amount of memory we can allocate

setInterval(() => {
  for (let i = 0; i < b.length; i++) {
    //b.length is the size of the buffer in bytes
    b[i] = 0x22;
  }
}, 5000);
