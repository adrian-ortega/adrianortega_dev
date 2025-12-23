import { to } from "../../routes/paths";
import { ColorSchemeSwitcher } from "../ColorSchemeSwitcher/ColorSchemeSwitcher";
import { Box } from "../Core/Box";
import { Container } from "../Core/Container";
import { Group } from "../Core/Group";

const AppHeader = () => {
  return (
    <Box className="Header-root">
      <Container className="Header-container">
        <Group justifyContent="space-between" alignItems="center">
          <Box className="Header-logo">
            <a href={to.home()}>
              <span>Adrian</span>
              <span>Ortega</span>
            </a>
          </Box>
          <nav className="Header-nav">
            <a href={to.home()}>Home</a>
            <a href={to.about()}>About</a>
            <a href={to.posts()}>Posts</a>
          </nav>
          <ColorSchemeSwitcher />
        </Group>
      </Container>
    </Box>
  );
};

export default AppHeader;
