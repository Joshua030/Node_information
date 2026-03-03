import { inject, injectable } from "tsyringe";

import {
  TOKENS,
  type TodoRepository,
  type ListTodosUseCase,
  type ListTodosQuery,
  type TodoListResult,
} from "../../ports";

@injectable()
export class ListTodosUseCaseImpl implements ListTodosUseCase {
  constructor(
    @inject(TOKENS.TodoRepository) private readonly todoRepo: TodoRepository,
  ) {}

  async execute(query: ListTodosQuery): Promise<TodoListResult> {
    const [todos, total] = await Promise.all([
      this.todoRepo.findAll({
        ...(query.completed !== undefined
          ? { completed: query.completed }
          : {}),
        ...(query.priority !== undefined ? { priority: query.priority } : {}),
        sortBy: query.sortBy ?? "createdAt",
        sortOrder: query.sortOrder ?? "desc",
        limit: query.limit ?? 20,
        offset: query.offset ?? 0,
      }),
      this.todoRepo.count({
        ...(query.completed !== undefined
          ? { completed: query.completed }
          : {}),
        ...(query.priority !== undefined ? { priority: query.priority } : {}),
      }),
    ]);

    return {
      todos: todos.map((t) => t.toJSON()),
      total,
    };
  }
}
