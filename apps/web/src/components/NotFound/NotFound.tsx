import { Box } from "../Core/Box";
import { Container } from "../Core/Container";

export function NotFound() {
  return (
    <Box className="NotFound-root">
      <Container>
        <Box className="Content-root">
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
        </Box>
      </Container>
    </Box>
  );
}
