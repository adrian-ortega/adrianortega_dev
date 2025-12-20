import { Request, Response, NextFunction } from "express";
import { readWidgetFile } from "../services/widgetsService";

export async function getWidgetBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const slug = String(req.params.slug || "").trim();
    if (!slug) {
      const err: any = new Error("Missing slug");
      err.status = 400;
      throw err;
    }
    const widget = await readWidgetFile(slug);
    return res.json(widget);
  } catch (e) {
    return next(e);
  }
}
