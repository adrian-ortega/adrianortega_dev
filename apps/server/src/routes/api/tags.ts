import { Router } from "express";
import { getTagBySlug, listTags } from "../../controllers/tagsController";

export const tagsRouter = Router();

tagsRouter.get("", listTags);
tagsRouter.get("/:slug", getTagBySlug);
