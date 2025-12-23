import path from "node:path";

import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";

import { apiRouter } from "./routes/api";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import { getPublicDir } from "./utils/paths";

const APP_ORIGIN = process.env.APP_ORIGIN ?? "http://localhost:5173";

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
  
  // SPA fallback: for any non-API route, send index.html
  app.get(/^\/(?!api|assets).*/, (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/assets")) {
      return next();
    }
    return res.sendFile(path.join(clientDistPath, "index.html"));
  });
  
  app.use(express.static(clientDistPath));
  // ---------------------------
  // 404 + error handling
  // ---------------------------
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
