import { Request, Response, NextFunction } from "express";
import { z } from "zod";

type RequestField = "body" | "query" | "params";

export function validate(schema: z.ZodType, field: RequestField = "body") {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req[field]);

      if (field === "query") {
        Object.defineProperty(req, "query", {
          value: validatedData,
          writable: true,
          configurable: true,
        });
      } else {
        req[field] = validatedData;
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: "Validation Error",
          details: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
}
