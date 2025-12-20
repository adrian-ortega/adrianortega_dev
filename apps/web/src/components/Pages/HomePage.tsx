
import { Box } from "../Core/Box";
import { Container } from "../Core/Container";
import Posts from "../Posts";

export function HomePage() {
  return (
    <Box className="Home-root">
      <Container>
        <Posts/>
      </Container>
    </Box>
  );
}
