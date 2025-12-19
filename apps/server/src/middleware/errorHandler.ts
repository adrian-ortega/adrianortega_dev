import type { NextFunction, Request, Response } from "express";

// Centralized error formatting for APIs.
export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const status = Number(err?.status ?? err?.statusCode ?? 400);
  const message = err?.message ?? "Request failed";

  // eslint-disable-next-line no-console
  if (process.env.NODE_ENV !== "test") console.error(err);

  return res.status(status).json({ error: message });
}
