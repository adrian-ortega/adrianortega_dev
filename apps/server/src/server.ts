import http from "node:http";

import { createApp } from "./app";

const PORT = Number(process.env.PORT ?? 8080);

export async function startServer() {
  const app = createApp();
  const httpServer = http.createServer(app);

  await new Promise<void>((resolve) => {
    httpServer.listen(PORT, () => resolve());
  });

  // eslint-disable-next-line no-console
  console.log(`🚀  HTTP:  http://localhost:${PORT}`);
}
