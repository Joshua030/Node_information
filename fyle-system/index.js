const fs = require("fs");

const content = fs.readFileSync("text.txt"); // is not use a decorer return buffer wit hexadecimal numbers

console.log(content.toString("utf-8"));
