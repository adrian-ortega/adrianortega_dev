import { Box } from "../Core/Box";
import { Container } from "../Core/Container";
import { Group } from "../Core/Group";

const AppHeader = () => {
  return (
    <Box className="Header-root">
      <Container className="Header-container">
        <Group justifyContent="space-between" alignItems="center">
          <div className="Header-logo">MyApp</div>
          <nav className="Header-nav">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </Group>
      </Container>
    </Box>
  );
}

export default AppHeader;
