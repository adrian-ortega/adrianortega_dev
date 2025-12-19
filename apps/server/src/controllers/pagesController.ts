import type { Request, Response, NextFunction } from "express";

import { listPageSlugs, readPageFile } from "../services/pagesService";

export async function listPages(_req: Request, res: Response, next: NextFunction) {
  try {
    const slugs = await listPageSlugs();
    return res.json({ slugs });
  } catch (e) {
    return next(e);
  }
}

export async function getPageBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const slug = String(req.params.slug || "").trim();
    if (!slug) {
      const err: any = new Error("Missing slug");
      err.status = 400;
      throw err;
    }
    const page = await readPageFile(slug);
    return res.json(page);
  } catch (e) {
    return next(e);
  }
}
