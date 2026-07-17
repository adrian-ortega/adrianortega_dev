import type { Request, Response, NextFunction } from "express";
import { listPostsByCategory, readPostFile } from "../services/postsService";
import { makeSlugController } from "./entityController";
import { readTagFile } from "../services/tagsService";
import { type TagEntity } from "../../../shared/types";

export async function listPosts(_req: Request, res: Response, next: NextFunction) {
  try {
    const tag = String(_req.query.tag || "").trim() || undefined;
    const posts = await listPostsByCategory(tag);
    let error: string | undefined = undefined;
    if (tag && posts?.length === 0) {
      error = `No posts found with tag "${tag}"`;
    }

    const meta: { tag?: TagEntity | null } = { tag: null };

    if (tag) {
      meta.tag = await readTagFile(tag as string)
    }

    return res.json({ posts, meta, error });
  } catch (e) {
    return next(e);
  }
}

export const getPostBySlug = makeSlugController(readPostFile, "Post");
