// ═══════════════════════════════════════════════════════════════
// LAYER 1: DOMAIN — Pure business logic, ZERO external dependencies
// This is the innermost hexagon. It knows nothing about:
// Express, databases, Zod, TSyringe, or any framework.
// ═══════════════════════════════════════════════════════════════

export interface TodoProps {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TodoPriority;
  createdAt: Date;
  updatedAt: Date;
}

export enum TodoPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export class Todo {
  private constructor(private readonly props: TodoProps) {}

  // ── Factory method ──────────────────────────────────
  static create(params: {
    id: string;
    title: string;
    description?: string;
    priority?: TodoPriority;
  }): Todo {
    const now = new Date();
    return new Todo({
      id: params.id,
      title: params.title.trim(),
      description: params.description?.trim() ?? "",
      completed: false,
      priority: params.priority ?? TodoPriority.MEDIUM,
      createdAt: now,
      updatedAt: now,
    });
  }

  // ── Reconstitution from persistence ─────────────────
  static fromPersistence(props: TodoProps): Todo {
    return new Todo({ ...props });
  }

  // ── Domain behavior ─────────────────────────────────
  complete(): Todo {
    if (this.props.completed) {
      throw new TodoAlreadyCompletedError(this.props.id);
    }
    return new Todo({
      ...this.props,
      completed: true,
      updatedAt: new Date(),
    });
  }

  reopen(): Todo {
    if (!this.props.completed) {
      throw new TodoNotCompletedError(this.props.id);
    }
    return new Todo({
      ...this.props,
      completed: false,
      updatedAt: new Date(),
    });
  }

  toggle(): Todo {
    return this.props.completed ? this.reopen() : this.complete();
  }

  updateTitle(title: string): Todo {
    return new Todo({
      ...this.props,
      title: title.trim(),
      updatedAt: new Date(),
    });
  }

  updateDescription(description: string): Todo {
    return new Todo({
      ...this.props,
      description: description.trim(),
      updatedAt: new Date(),
    });
  }

  changePriority(priority: TodoPriority): Todo {
    return new Todo({
      ...this.props,
      priority,
      updatedAt: new Date(),
    });
  }

  // ── Getters (immutable access) ──────────────────────
  get id(): string {
    return this.props.id;
  }
  get title(): string {
    return this.props.title;
  }
  get description(): string {
    return this.props.description;
  }
  get completed(): boolean {
    return this.props.completed;
  }
  get priority(): TodoPriority {
    return this.props.priority;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // ── Serialization ───────────────────────────────────
  toJSON(): TodoProps {
    return { ...this.props };
  }
}

// ── Domain Errors ─────────────────────────────────────
export class TodoDomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "TodoDomainError";
  }
}

export class TodoAlreadyCompletedError extends TodoDomainError {
  constructor(id: string) {
    super(`Todo ${id} is already completed`, "TODO_ALREADY_COMPLETED");
  }
}

export class TodoNotCompletedError extends TodoDomainError {
  constructor(id: string) {
    super(`Todo ${id} is not completed`, "TODO_NOT_COMPLETED");
  }
}

export class TodoNotFoundError extends TodoDomainError {
  constructor(id: string) {
    super(`Todo ${id} not found`, "TODO_NOT_FOUND");
  }
}
