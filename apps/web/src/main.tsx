import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import "./reset.css";
import "./prism.css";
import "./index.css";
import "./dark.css";

import App from "./App.tsx";
import { AppStateProvider } from "./utils/AppStateProvider.tsx";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </StrictMode>
);
