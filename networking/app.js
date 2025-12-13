const http = require('http');

const port = 4000; // prefer ports above 3000 to avoid conflicts with common development servers

const server = http.createServer((req, res) => {
  const data = { message: "Hello, World!" };
  res.setHeader('Content-Type', 'application/json');
  res.setHeader("Connection", "close"); // Ensure the connection is closed after the response
  res.statusCode = 200;
  res.end(JSON.stringify(data));
});

// Start the server
server.listen(port, "127.0.0.1", () => {// ip address of my local machine to share with other devices on the network
  console.log(`Server running on port ${port}`);
});