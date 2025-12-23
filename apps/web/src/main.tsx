import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./reset.css";
import "./prism.css";
import "./index.css";

import App from "./App.tsx";
import { AppStateProvider } from "./utils/AppStateProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </StrictMode>
);
