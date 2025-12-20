import { Request, Response, NextFunction } from "express";
import { listTagSlugs, readTagFile } from "../services/tagsService";

export async function listTags(_req: Request, res: Response, next: NextFunction) {
  try {
    const slugs = await listTagSlugs();
    return res.json({ slugs });
  } catch (e) {
    return next(e);
  }
}

export async function getTagBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const slug = String(req.params.slug || "").trim();
    if (!slug) {
      const err: any = new Error("Missing slug");
      err.status = 400;
      throw err;
    }
    const sidebar = await readTagFile(slug);
    return res.json(sidebar);
  } catch (e) {
    return next(e);
  }
}
