import { Router } from "express";
import { makeSlugController } from "../../controllers/entityController";
import { getEntityBySlug } from "../../services/mdService";
import { ENTITY_TYPE, WidgetEntity } from "../../../../shared/types";

export const widgetsRouter = Router();

widgetsRouter.get(
  "/:slug",
  makeSlugController(
    (slug) => getEntityBySlug<WidgetEntity>(ENTITY_TYPE.WIDGET, slug),
    "Widget",
  ),
);
