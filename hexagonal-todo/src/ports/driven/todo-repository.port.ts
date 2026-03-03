// ═══════════════════════════════════════════════════════════════
// LAYER 2: PORTS — Contracts / Interfaces
// Driven Port (Secondary): Defines WHAT the app needs from
// the outside world, without saying HOW.
// ═══════════════════════════════════════════════════════════════

import { Todo, TodoPriority } from "../../domain";

export interface FindAllOptions {
  completed?: boolean;
  priority?: TodoPriority;
  sortBy?: "createdAt" | "updatedAt" | "priority";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface TodoRepository {
  findAll(options?: FindAllOptions): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  save(todo: Todo): Promise<void>;
  delete(id: string): Promise<void>;
  count(
    options?: Pick<FindAllOptions, "completed" | "priority">,
  ): Promise<number>;
  existsWithTitle(title: string): Promise<boolean>;
}
