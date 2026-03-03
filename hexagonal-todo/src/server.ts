import "reflect-metadata";
import { app } from "main";
import * as readline from "readline";

const startServer = (port: number | string) => {
  const server = app.listen(port, () => {
    console.log(`
  ═══════════════════════════════════════════════════════════
  ⬡  Hexagonal Todo API running on http://localhost:${port}
  ═══════════════════════════════════════════════════════════
    `);
  });

  server.once("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(`\n⚠ Port ${port} is already in use.`);

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question(
        `Do you want to start on port ${+port + 1}? (y/n): `,
        (answer) => {
          rl.close();
          if (answer.toLowerCase() === "y") {
            startServer(+port + 1);
          } else {
            console.log("Server not started. Exiting.");
            gracefulShutdown("Port In Use");
          }
        },
      );
    } else {
      console.error("Server error:", err.message);
      gracefulShutdown("Server Error");
    }
  });

  const gracefulShutdown = (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log("All connections closed. Exiting.");
      process.exit(1); // Exit with error code
    });

    // Force kill if it takes too long
    setTimeout(() => {
      console.error("Forced shutdown after timeout.");
      process.exit(1); // Exit with error code
    }, 10_000);
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM")); // Handle termination signal
  process.on("SIGINT", () => gracefulShutdown("SIGINT")); // Handle Ctrl+C
};

const PORT = process.env.PORT ?? 3000;
startServer(+PORT);

/* main.ts — application setup (things the app needs to exist):

DI container configuration
Database connection / ORM initialization
Logger setup
Environment config validation
Event bus / message broker setup
Cache client initialization (Redis, etc.)
Migration runner
Seed data (in dev)

server.ts — runtime concerns (things the app needs to run as a server):

Listening on a port
Graceful shutdown (SIGTERM, SIGINT)
Port conflict handling
Cluster/worker setup
Health check endpoints for infra (k8s probes)
SSL/TLS configuration
Process-level error handlers (uncaughtException, unhandledRejection
 */
