import type { Request, Response, NextFunction } from "express";
import {
  listPostsByCategory,
  readPostFile,
  getPostNavigation,
  getRelatedPosts,
} from "../services/postsService";
import { readTagFile } from "../services/tagsService";
import { type PostDetail, type TagEntity } from "../../../shared/types";

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

// GET /api/posts/:slug — post plus next/prev navigation.
// Custom instead of makeSlugController because the response is
// PostDetail (entity + navigation), not the bare entity.
export async function getPostBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const slug = String(req.params.slug || "").trim();
    if (!slug) {
      return res.status(400).json({ error: "Missing slug" });
    }

    const post = await readPostFile(slug).catch(() => null);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const navigation = await getPostNavigation(slug);
    const detail: PostDetail = { ...post, navigation };
    return res.json(detail);
  } catch (e) {
    return next(e);
  }
}

// GET /api/posts/:slug/related?limit=n
export async function getRelatedPostsBySlug(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const slug = String(req.params.slug || "").trim();
    if (!slug) {
      return res.status(400).json({ error: "Missing slug" });
    }

    const rawLimit = Number(req.query.limit);
    const limit = Number.isFinite(rawLimit)
      ? Math.min(Math.max(Math.trunc(rawLimit), 1), 10)
      : 3;

    const posts = await getRelatedPosts(slug, limit);
    if (posts === null) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.json({ posts });
  } catch (e) {
    return next(e);
  }
}
