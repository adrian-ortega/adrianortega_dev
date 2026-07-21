import { Router } from "express";
import {
  getPostBySlug,
  getRelatedPostsBySlug,
  listPosts,
} from "../../controllers/postsController";

export const postsRouter = Router();

// GET /api/posts
postsRouter.get("", listPosts);

// GET /api/posts/:slug/related?limit=n
postsRouter.get("/:slug/related", getRelatedPostsBySlug);

// GET /api/posts/:slug
postsRouter.get("/:slug", getPostBySlug);
