import "dotenv/config";

import { startServer } from "./server";

startServer().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
