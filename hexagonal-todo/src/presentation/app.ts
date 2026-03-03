import express from "express";
import { todoRouter } from "./http/todo.router";

export function createApp(): express.Application {
  const app = express();

  app.use(express.json());

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Mount routes
  app.use("/api/todos", todoRouter);

  return app;
}
