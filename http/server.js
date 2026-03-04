const http = require("node:http");
const server = http.createServer();

server.on("request", (req, res) => {
  console.log("---------METHOD---------");
  console.log(req.method);
  console.log("---------URL---------");
  console.log(req.url);
  console.log("---------HEADERS---------");
  console.log(req.headers);
  const name = req.headers.name;

  console.log("---------BODY---------");

  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
    console.log("---------CHUNK---------");
    console.log(chunk.toString());
  });
  req.on("end", () => {
    console.log("---------END OF REQUEST---------");
    data = JSON.parse(data);
    console.log(data, "---------PARSED BODY---------");
    console.log(name);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: `Hello ${name}, your post titled "${data.title}" has been created!`,
      }),
    );
  });
});

server.listen(8050, () => {
  console.log("Server running at http://localhost:8050/");
});
