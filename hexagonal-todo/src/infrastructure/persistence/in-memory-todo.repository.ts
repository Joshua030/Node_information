// ═══════════════════════════════════════════════════════════════
// LAYER 4: ADAPTERS — Concrete implementations of ports
//
// This adapter implements TodoRepository using an in-memory Map.
// You could create a PostgresTodoRepository, MongoTodoRepository,
// etc. — all implementing the SAME interface. The use cases
// would never know the difference.
// ═══════════════════════════════════════════════════════════════

import { injectable } from "tsyringe";
import { Todo, TodoPriority, TodoProps } from "../../domain";
import { TodoRepository, FindAllOptions } from "../../ports";

@injectable()
export class InMemoryTodoRepository implements TodoRepository {
  private readonly store = new Map<string, TodoProps>();

  async findAll(options?: FindAllOptions): Promise<Todo[]> {
    let todos = Array.from(this.store.values());

    // Filter
    if (options?.completed !== undefined) {
      todos = todos.filter((t) => t.completed === options.completed);
    }
    if (options?.priority !== undefined) {
      todos = todos.filter((t) => t.priority === options.priority);
    }

    // Sort
    const sortBy = options?.sortBy ?? "createdAt";
    const sortOrder = options?.sortOrder ?? "desc";
    todos.sort((a, b) => {
      let comparison: number;
      if (sortBy === "priority") {
        const order = { [TodoPriority.HIGH]: 3, [TodoPriority.MEDIUM]: 2, [TodoPriority.LOW]: 1 };
        comparison = order[a.priority] - order[b.priority];
      } else {
        const aDate = new Date(a[sortBy]).getTime();
        const bDate = new Date(b[sortBy]).getTime();
        comparison = aDate - bDate;
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

    // Paginate
    const offset = options?.offset ?? 0;
    const limit = options?.limit ?? 20;
    todos = todos.slice(offset, offset + limit);

    return todos.map((props) => Todo.fromPersistence(props));
  }

  async findById(id: string): Promise<Todo | null> {
    const props = this.store.get(id);
    return props ? Todo.fromPersistence(props) : null;
  }

  async save(todo: Todo): Promise<void> {
    this.store.set(todo.id, todo.toJSON());
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }

  async count(options?: Pick<FindAllOptions, "completed" | "priority">): Promise<number> {
    let todos = Array.from(this.store.values());
    if (options?.completed !== undefined) {
      todos = todos.filter((t) => t.completed === options.completed);
    }
    if (options?.priority !== undefined) {
      todos = todos.filter((t) => t.priority === options.priority);
    }
    return todos.length;
  }

  async existsWithTitle(title: string): Promise<boolean> {
    const normalized = title.trim().toLowerCase();
    return Array.from(this.store.values()).some(
      (t) => t.title.toLowerCase() === normalized
    );
  }
}
