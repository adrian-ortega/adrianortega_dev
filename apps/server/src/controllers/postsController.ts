import type { Request, Response, NextFunction } from "express";
import { listPostsByCategory, readPostFile } from "../services/postsService";
import { makeSlugController } from "./entityController";

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

export const getPostBySlug = makeSlugController(readPostFile, "Post");
