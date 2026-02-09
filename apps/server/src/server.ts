import http from "node:http";

import { createApp } from "./app";
import { getContentDir, getDataDir, getPublicDir } from "./utils/paths";

const PORT = Number(process.env.PORT ?? 8080);

export async function startServer() {
  const app = createApp();
  const httpServer = http.createServer(app);

  await new Promise<void>((resolve) => {
    httpServer.listen(PORT, () => resolve());
    console.log("Server started");
    console.log("Environment:", process.env.NODE_ENV || "not set");
    if (Boolean(process.env.ENABLE_CACHE) === true) {
      // eslint-disable-next-line no-console
      console.log("⚡️ Cache enabled");
    }

    console.log("Data directory:", getDataDir());
    console.log("Content directory:", getContentDir());
    console.log("Public directory:", getPublicDir());
  });

  // eslint-disable-next-line no-console
  console.log(`🚀 HTTP:  http://localhost:${PORT}`);
}
