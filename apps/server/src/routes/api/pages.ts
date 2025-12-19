import { Router } from "express";

import { getPageBySlug, listPages } from "../../controllers/pagesController";

export const pagesRouter = Router();

// GET /api/pages
pagesRouter.get("/", listPages);

// GET /api/pages/:slug
pagesRouter.get("/:slug", getPageBySlug);
