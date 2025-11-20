const { Buffer } = require("buffer");

const memoryContainer = Buffer.alloc(3); //4 bytes (32 bits)

memoryContainer;
memoryContainer[0] = 0b01001000; //save binary numbers
// memoryContainer[2] = 0xb6;
memoryContainer[1] = 0b01101001;
memoryContainer[2] = 0b00100001;

console.log("memory", memoryContainer);

console.log(memoryContainer);
console.log(memoryContainer[0]);
console.log(memoryContainer[1]);
console.log(memoryContainer[2]);

console.log(memoryContainer.toString("utf-8"));

/* const buff = Buffer.from([0x48, 0x69, 0x21]);
console.log(buff.toString("utf-8")); */

/*
const buff = Buffer.from("486921", "hex");
console.log(buff.toString("utf-8"));
*/

const buff = Buffer.from("Hi!", "utf-8");
console.log(buff);
