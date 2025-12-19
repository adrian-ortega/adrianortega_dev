import { Router } from "express";
import { getSidebarBySlug } from "../../controllers/sidebarsController";

export const sidebarsRouter = Router();

sidebarsRouter.get("/:slug", getSidebarBySlug);
