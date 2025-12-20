import { RouterProvider } from "react-router/dom";
import { Stack } from "./components/Core/Stack";
import { createRouter } from "./routes";
import AppHeader from "./components/App/AppHeader";
import AppFooter from "./components/App/AppFooter";

function App() {
  const router = createRouter();
  return (
    <Stack className="App-root" gap={0}>
      <AppHeader/>
      <RouterProvider router={router} />
      <AppFooter/>
    </Stack>
  );
}

export default App
