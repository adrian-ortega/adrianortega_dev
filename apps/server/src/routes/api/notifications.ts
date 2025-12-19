import { Router } from "express";
import { getNotificationBySlug } from "../../controllers/notificationsController";

export const notificationsRouter = Router();

notificationsRouter.get("/:slug", getNotificationBySlug);
