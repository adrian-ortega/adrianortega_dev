import { RouterProvider } from "react-router/dom";
import { Stack } from "./components/Core/Stack";
import { createRouter } from "./routes";
import AppHeader from "./components/App/AppHeader";
import AppFooter from "./components/App/AppFooter";
import AppMobileMenu from "./components/App/AppMobileMenu";

function App() {
  const router = createRouter();
  return (
    <Stack className="App-root" gap={0}>
      <title>Adrian Ortega - Software Engineer</title>
      <AppHeader/>
      <RouterProvider router={router} />
      <AppFooter />
      <AppMobileMenu />
    </Stack>
  );
}

export default App
