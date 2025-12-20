import { Request, Response, NextFunction } from "express";
import { readSidebarFile } from "../services/sidebarsService";

export async function getSidebarBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const slug = String(req.params.slug || "").trim();
    if (!slug) {
      const err: any = new Error("Missing slug");
      err.status = 400;
      throw err;
    }
    const sidebar = await readSidebarFile(slug);
    return res.json(sidebar);
  } catch (e) {
    return next(e);
  }
}
