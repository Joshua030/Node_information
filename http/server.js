const http = require("node:http");
const server = http.createServer();

server.on("request", (req, res) => {
  console.log("---------METHOD---------");
  console.log(req.method);
  console.log("---------URL---------");
  console.log(req.url);
  console.log("---------HEADERS---------");
  console.log(req.headers);
  console.log("---------BODY---------");
  req.on("data", (chunk) => {
    console.log(chunk.toString());
  });
  req.on("end", () => {
    console.log("---------END OF REQUEST---------");
  });
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, World!\n");
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
