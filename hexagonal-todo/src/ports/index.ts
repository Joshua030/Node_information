// ── Driven Ports (Secondary) ──────────────────────────
export type {
  TodoRepository,
  FindAllOptions,
} from "./driven/todo-repository.port";
// ── Driving Ports (Primary) ──────────────────────────
export type {
  ListTodosUseCase,
  ListTodosQuery,
  TodoListResult,
} from "./driving/todo-use-cases.port";

// ═══════════════════════════════════════════════════════════════
// TSyringe Injection Tokens
// These string tokens map interfaces → concrete implementations
// in the DI container. This is the "wiring" layer.
// ═══════════════════════════════════════════════════════════════

export const TOKENS = {
  // Driven ports
  TodoRepository: Symbol.for("TodoRepository"),
  // Driving ports (use cases)
  ListTodosUseCase: Symbol.for("ListTodosUseCase"),
} as const;
