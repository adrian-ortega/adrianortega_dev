import "dotenv/config";

import Sentry from "@sentry/node";

import { startServer } from "./server";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  sendDefaultPii: true,
});

startServer().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
