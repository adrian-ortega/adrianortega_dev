import type { Request, Response, NextFunction } from "express";
import { listPostsByCategory, readPostFile } from "../services/postsService";

export async function listPosts(_req: Request, res: Response, next: NextFunction) {
  try {
    const tag = String(_req.query.tag || "").trim() || undefined;
    const posts = await listPostsByCategory(tag);
    return res.json({ posts });
  } catch (e) {
    return next(e);
  }
}

export async function getPostBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const slug = String(req.params.slug || "").trim();
    if (!slug) {
      const err: any = new Error("Missing slug");
      err.status = 400;
      throw err;
    }
    const post = await readPostFile(slug);
    return res.json(post);
  } catch (e) {
    return next(e);
  }
}
