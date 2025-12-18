import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import http from "node:http";
import path from "node:path";
import bodyParser from "body-parser";
import cors from "cors";

const PORT = Number(process.env.PORT ?? 3000);
const APP_ORIGIN = process.env.APP_ORIGIN ?? "http://localhost:5173";

async function start() {
  const app = express();
  const httpServer = http.createServer(app);

  const jsonBodyParser = bodyParser.json();
  const emptyBodyParser = (req: Request, _res: Response, next: NextFunction) => {
    if (req.body === undefined) req.body = {};
    next();
  };

  app.use(
    cors({
      origin: [APP_ORIGIN],
      credentials: true,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: [
        "content-type",
        "authorization",
        "apollo-require-preflight",
      ],
    }),
  );

  app.use("/api", jsonBodyParser, emptyBodyParser, (req, res) => {
    res.json({ message: "Hello from the API!" });
  });


  // ---------------------------
  // Static frontend hosting
  // ---------------------------

  // In both dev (tsx/ts-node) and prod (compiled JS in dist), we start the
  // server from the project root (/app in Docker, repo root locally).
  // The built web app always lives at apps/web/dist relative to that root.
  const projectRoot = process.cwd();
  const clientDistPath = path.resolve(projectRoot, "apps/web/dist");

  // Serve static assets (JS, CSS, images)
  app.use(express.static(clientDistPath));

  // SPA fallback: for any non-API route, send index.html
  app.get(/^\/(?!api|media).*/, (req, res, next) => {
    // Let API & media routes pass through
    if (req.path.startsWith("/api") || req.path.startsWith("/media")) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, "index.html"));
  });


  // Generic errors
  app.use(
    (
      err: any,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      const status = err?.status || 400;
      const message = err?.message || "Request failed";
      return res.status(status).json({ error: message });
    },
  );


  httpServer.listen(PORT, () => {
    console.log(`🚀  HTTP:  http://localhost:${PORT}`);
    console.log(`🔐  CORS:  allowing ${APP_ORIGIN}`);
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
