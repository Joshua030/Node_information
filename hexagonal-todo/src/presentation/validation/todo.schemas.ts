// ═══════════════════════════════════════════════════════════════
// PRESENTATION LAYER: Zod Validation Schemas
//
// Zod lives in the OUTER layer (presentation / adapter).
// It validates HTTP input BEFORE it reaches the use cases.
// The domain never knows Zod exists.
// ═══════════════════════════════════════════════════════════════

import { TodoPriority } from "@domain/index";
import { z } from "zod";

// ── Request Schemas ───────────────────────────────────

export const CreateTodoSchema = z.object({
  title: z
    .string("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be under 100 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must be under 500 characters")
    .trim()
    .optional()
    .default(""),
  priority: z
    .nativeEnum(TodoPriority, {
      message: `Priority must be one of: ${Object.values(TodoPriority).join(", ")}`,
    })
    .optional()
    .default(TodoPriority.MEDIUM),
});

export const UpdateTodoSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must be under 100 characters")
      .trim()
      .optional(),
    description: z
      .string()
      .max(500, "Description must be under 500 characters")
      .trim()
      .optional(),
    priority: z
      .enum(TodoPriority, {
        error: `Priority must be one of: ${Object.values(TodoPriority).join(", ")}`,
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    error: "At least one field must be provided for update",
  });

export const ListTodosQuerySchema = z.object({
  completed: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  priority: z.enum(TodoPriority).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "priority"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

export const TodoIdParamSchema = z.object({
  id: z.uuid("Invalid todo ID format"),
});

// ── Infer types from schemas ──────────────────────────
export type CreateTodoInput = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoInput = z.infer<typeof UpdateTodoSchema>;
export type ListTodosQueryInput = z.infer<typeof ListTodosQuerySchema>;
