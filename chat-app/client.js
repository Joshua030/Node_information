const net = require('net');
const readline = require('readline/promises');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Utility function to clear the current line in the console
const clearLine = (dir) => {
  return new Promise((resolve) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
}

const moveCursor = (dx, dy) => {
  return new Promise((resolve) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
}


const client = net.createConnection({
  host: "127.0.0.1",
  port: 3008
}, async () => {
  console.log("Connected to server")

  const ask = async () => {
    const message = await rl.question("Enter a message > ")
    // Move the cursor up one line
    await moveCursor(0, -1);
    // Clear the current line after input
    await clearLine(0);
    client.write(message)
  }

  await ask();

  // handle data received from server
  client.on("data", async (data) => {
    console.log(); // print a new line
    await moveCursor(0, -1);
    await clearLine(0);
    console.log("Received from server:", data.toString("utf-8"))
    await ask()
  })

})



// Add error handler - this is essential!
client.on("error", (err) => {
  console.log("Connection error:", err.message)
})

// dispatch accton with connection is closed
client.on("close", () => {
  console.log("Connection closed")
})

// dispatch accton with server ends the connection gracefully
client.on("end", () => {
  console.log("Disconnected from server")
})