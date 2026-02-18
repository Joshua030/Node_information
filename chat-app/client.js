const net = require("net");
const readline = require("readline/promises");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Utility function to clear the current line in the console
const clearLine = (dir) => {
  return new Promise((resolve) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

let id;

const client = net.createConnection(
  {
    host: "127.0.0.1",
    port: 3008,
  },
  async () => {
    console.log("Connected to server");

    const ask = async (id) => {
      const message = await rl.question("Enter a message > ");
      // Move the cursor up one line
      await moveCursor(0, -1);
      // Clear the current line after input
      await clearLine(0);

      if (id) {
        client.write(`${id}-message-${message}`);
      }
    };

    await ask(id);

    // handle data received from server
    client.on("data", async (data) => {
      // print a new line
      console.log();
      await moveCursor(0, -1);
      await clearLine(0);

      if (data.toString("utf-8").substring(0, 2) === "id") {
        // when we are getting the id...

        id = data.toString("utf-8").substring(3);
        console.log(`Your client ID is: ${id}\n`);
      } else {
        // when we are getting the message...

        console.log("Received from server:", data.toString("utf-8"));
      }

      await ask(id);
    });
  }
);

// Add error handler - this is essential!
client.on("error", (err) => {
  console.log("Connection error:", err.message);
});

// dispatch accton with connection is closed
client.on("close", () => {
  console.log("Connection closed");
});

// dispatch accton with server ends the connection gracefully
client.on("end", () => {
  console.log("Disconnected from server");
});
