import { Request, Response, NextFunction } from "express";
import { readNotificationFile } from "../services/notificationsService";

export async function getNotificationBySlug(req: Request, res: Response, next: NextFunction) {
  try {
      const slug = String(req.params.slug || "").trim();
      if (!slug) {
        const err: any = new Error("Missing slug");
        err.status = 400;
        throw err;
      }
      const notification = await readNotificationFile(slug);
      return res.json(notification);
    } catch (e) {
      return next(e);
    }
}
