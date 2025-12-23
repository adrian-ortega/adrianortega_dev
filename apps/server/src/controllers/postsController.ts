import type { Request, Response, NextFunction } from "express";
import { listPostsByCategory, readPostFile } from "../services/postsService";

export async function listPosts(_req: Request, res: Response, next: NextFunction) {
  try {
    const tag = String(_req.query.tag || "").trim() || undefined;
    const posts = await listPostsByCategory(tag);
    let error: string | undefined = undefined;
    if (tag && posts?.length === 0) {
      error = `No posts found with tag "${tag}"`;
    }

    return res.json({ posts, error });
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
    if ((e as Error).message === "Post not found") {
      return res.status(404).json({ error: "Post not found" });
    }

    return next(e);
  }
}
