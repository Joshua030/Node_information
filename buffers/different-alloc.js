const { Buffer } = require("buffer");

// Safe buffer (initialized to 0)
const buffer = Buffer.alloc(10000);

console.log(Buffer.poolSize >>> 1); //if you allocate some less than this with unsafe alloc is the faster way
// Unsafe buffer (may contain old memory data)
const unsafeBuffer = Buffer.allocUnsafe(10000);

// using normal buffer doesn't get any result
for (let i = 0; i < unsafeBuffer.length; i++) {
  if (unsafeBuffer[i] !== 0) {
    console.log(
      `Element at position ${i} has value: ${unsafeBuffer[i].toString(2)}`
    );
  }
}
