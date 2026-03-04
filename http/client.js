const http = require("node:http");

/* An agent is an object that manages connection persistence 
and reuse for HTTP clients. It allows you to keep connections 
alive and reuse them for multiple requests, which can improve 
performance by reducing the overhead of establishing new 
 connections for each request. */

const agent = new http.Agent({
  keepAlive: true,
});

const request = http.request({
  agent,
  hostname: "localhost",
  port: 8050,
  method: "POST",
  path: "/create-post",
  headers: {
    "Content-Type": "application/json",
    // "Content-Length": Buffer.byteLength(
    //   JSON.stringify({ message: "Hey you still there?" }),
    //   "utf-8",
    // ),
    name: "Jose Luis",
  },
});

// This event ise emmited only once
request.on("response", (res) => {
  console.log("---------STATUS CODE---------");
  console.log(res.statusCode);
  console.log("---------HEADERS---------");
  console.log(res.headers);
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
    console.log("---------CHUNK---------");
    console.log(chunk.toString());
  });
  res.on("end", () => {
    console.log("---------END OF RESPONSE---------");
    data = JSON.parse(data);
    console.log(data, "---------PARSED BODY---------");
  });
});

// request.write(JSON.stringify({ title: "Hi there!" }));
// request.write(JSON.stringify({ body: "How are you doing?" }));
// request.write(JSON.stringify({ message: "Hey you still there?" }));

request.end(
  JSON.stringify({
    title: "Hi there!",
    body: "This is some text and more and more",
  }),
);
