import { Router } from "express";
import { getPostBySlug, listPosts } from "../../controllers/postsController";

export const postsRouter = Router();

// GET /api/posts
postsRouter.get("", listPosts);

// GET /api/posts/:slug
postsRouter.get("/:slug", getPostBySlug);
