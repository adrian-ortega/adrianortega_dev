import type { Request, Response, NextFunction } from "express";
import { listPageSlugs, readPageFile } from "../services/pagesService";
import { makeSlugController } from "./entityController";

export async function listPages(_req: Request, res: Response, next: NextFunction) {
  try {
    const slugs = await listPageSlugs();
    return res.json({ slugs });
  } catch (e) {
    return next(e);
  }
}

export const getPageBySlug = makeSlugController(readPageFile, "Page");
