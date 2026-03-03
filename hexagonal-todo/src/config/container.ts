// ═══════════════════════════════════════════════════════════════
// DI CONTAINER — TSyringe Configuration
//
// This is the COMPOSITION ROOT. It wires together:
//   Ports (interfaces) → Adapters (concrete implementations)
//
// This is the ONLY place that knows about both ports AND adapters.
// To swap implementations (e.g., InMemory → Postgres), you ONLY
// change this file. Everything else stays untouched.
// ═══════════════════════════════════════════════════════════════

import { container } from "tsyringe";
import { TOKENS } from "../ports";
import { ListTodosUseCaseImpl } from "@application/index";
import { InMemoryTodoRepository } from "@infrastructure/index";

// Adapters (concrete implementations)

// Use case implementations

export function configureDependencies(): void {
  // ────────────────────────────────────────────────────
  // Register DRIVEN PORTS → ADAPTERS
  // ────────────────────────────────────────────────────
  // "When someone asks for TodoRepository, give them InMemoryTodoRepository"
  //
  // To switch to Postgres, just change this ONE line:
  //   container.registerSingleton(TOKENS.TodoRepository, PostgresTodoRepository);
  //
  container.registerSingleton(TOKENS.TodoRepository, InMemoryTodoRepository);
  // ────────────────────────────────────────────────────
  // Register DRIVING PORTS → USE CASE IMPLEMENTATIONS
  // ────────────────────────────────────────────────────
  container.registerSingleton(TOKENS.ListTodosUseCase, ListTodosUseCaseImpl);
}
