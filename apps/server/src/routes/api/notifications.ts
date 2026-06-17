import { Router } from "express";
import { makeSlugController } from "../../controllers/entityController";
import { getEntityBySlug } from "../../services/mdService";
import { ENTITY_TYPE, NotificationEntity } from "../../../../shared/types";

export const notificationsRouter = Router();

notificationsRouter.get(
  "/:slug",
  makeSlugController(
    (slug) => getEntityBySlug<NotificationEntity>(ENTITY_TYPE.NOTIFICATION, slug),
    "Notification",
  ),
);
