import { Request, Response, NextFunction } from "express";
import { listTagSlugs, readTagFile } from "../services/tagsService";
import { makeSlugController } from "./entityController";

export async function listTags(_req: Request, res: Response, next: NextFunction) {
  try {
    const slugs = await listTagSlugs();
    return res.json({ slugs });
  } catch (e) {
    return next(e);
  }
}

export const getTagBySlug = makeSlugController(readTagFile, "Tag");
