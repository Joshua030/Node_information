import { type ListTodosUseCase, TOKENS } from "@ports/index";
import { validate } from "@presentation/middleware/validation.middleware";
import { ListTodosQuerySchema } from "@presentation/validation/todo.schemas";

import { Router, Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
const router = Router();

// Helper to wrap async route handlers
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

  // ── GET /todos ────────────────────────────────────────
router.get(
  "/",
  validate(ListTodosQuerySchema, "query"),
  asyncHandler(async (req: Request, res: Response) => {
    const useCase = container.resolve<ListTodosUseCase>(TOKENS.ListTodosUseCase);
    const result = await useCase.execute(req.query as Record<string, unknown>);
    res.json({ data: result.todos, meta: { total: result.total } });
  })
);

export { router as todoRouter };