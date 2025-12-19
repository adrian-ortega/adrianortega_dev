import { Router } from "express";
import { getWidgetBySlug } from "../../controllers/widgetsController";

export const widgetsRouter = Router();

widgetsRouter.get("/:slug", getWidgetBySlug);
