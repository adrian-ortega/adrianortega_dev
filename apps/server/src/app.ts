import path from "node:path";

import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";

import { apiRouter } from "./routes/api";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import { getContentDir, getPublicDir } from "./utils/paths";

const APP_ORIGIN = process.env.APP_ORIGIN ?? "http://localhost:5173";
const CONTENT_DIR = process.env.APP_CONTENT_DIR || path.join(process.cwd(), "content");
const CONTENT_ASSETS_DIR = path.join(CONTENT_DIR, "assets");

export function createApp() {
  const app = express();

  // ---------------------------
  // Global middleware
  // ---------------------------

  app.use(
    cors({
      origin: [APP_ORIGIN],
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["content-type", "authorization"],
    }),
  );

  // JSON body parsing for API routes only (keeps non-API routes lightweight)
  const jsonBodyParser = bodyParser.json({ limit: "1mb" });
  const ensureBody = (req: Request, _res: Response, next: NextFunction) => {
    if (req.body === undefined) req.body = {};
    next();
  };

  // ---------------------------
  // API
  // ---------------------------
  app.use("/api", jsonBodyParser, ensureBody, apiRouter);

  // ---------------------------
  // Static frontend hosting
  // ---------------------------
  // In dev (tsx/ts-node) and prod (compiled JS in dist), we start the
  // server from the project root (/app in Docker, repo root locally).
  // The built web app always lives at apps/web/dist relative to that root.
  const clientDistPath = getPublicDir();

  // Serve static web build output first.
  // IMPORTANT: `index: false` prevents Express from auto-serving index.html,
  // so our SPA fallback below is the *only* way index.html is returned.
  app.use(express.static(clientDistPath, { index: false }));

  // Serve content repository assets without colliding with Vite's /assets/*.
  // (Vite puts JS/CSS in /assets; copying images there can blank the site.)
  // @TODO is this necessary?
  app.use(
    "/content-assets",
    express.static(CONTENT_ASSETS_DIR, {
      fallthrough: false,
    })
  );

  // SPA fallback: any non-API, non-static route gets index.html
  app.get(/^\/(?!api|assets|content-assets).*/, (req, res) => {
    return res.sendFile(path.join(clientDistPath, "index.html"));
  });
  // ---------------------------
  // 404 + error handling
  // ---------------------------
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
