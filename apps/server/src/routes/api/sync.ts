import { Router } from "express";
import { showSyncStatus, sync } from "../../controllers/syncController";

export const syncRouter = Router();

// POST /api/sync
// @TODO should this be protected with authentication?
//
syncRouter.post("/", sync);
syncRouter.get("/", showSyncStatus);
