// ── DTOs (Data Transfer Objects) ──────────────────────

import type { TodoPriority, TodoProps } from "@domain/entities/todo.entity";

export interface ListTodosQuery {
  completed?: boolean;
  priority?: TodoPriority;
  sortBy?: "createdAt" | "updatedAt" | "priority";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface TodoListResult {
  todos: TodoProps[];
  total: number;
}
// ── Use Case Interfaces ──────────────────────────────

export interface ListTodosUseCase {
  execute(query: ListTodosQuery): Promise<TodoListResult>;
}
