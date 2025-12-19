import type { Request, Response } from "express";

export function getHealth(_req: Request, res: Response) {
  return res.json({ ok: true, service: "server", timestamp: new Date().toISOString() });
}
