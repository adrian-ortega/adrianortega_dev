import { Router } from "express";
import { makeSlugController } from "../../controllers/entityController";
import { getEntityBySlug } from "../../services/mdService";
import { ENTITY_TYPE, SidebarEntity } from "../../../../shared/types";

export const sidebarsRouter = Router();

sidebarsRouter.get(
  "/:slug",
  makeSlugController(
    (slug) => getEntityBySlug<SidebarEntity>(ENTITY_TYPE.SIDEBAR, slug),
    "Sidebar",
  ),
);
