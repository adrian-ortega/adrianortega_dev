import { to } from "../../routes/paths";
import { ColorSchemeSwitcher } from "../ColorSchemeSwitcher/ColorSchemeSwitcher";
import { Box } from "../Core/Box";
import { Container } from "../Core/Container";
import { Group } from "../Core/Group";
import AppLogo from "./AppLogo";

const AppHeader = () => {
  return (
    <Box className="Header-root">
      <Container className="Header-container">
        <Group justifyContent="space-between" alignItems="center">
          <Box className="Header-logo">
            <a href={to.home()}>
              <span>Adrian</span>
              <span>Ortega</span>
              <AppLogo/>
            </a>
          </Box>
          <Group alignItems="center">
            <Group component="nav" className="Header-nav">
              <a href={to.about()}>About</a>
              <a href={to.posts()}>Posts</a>
            </Group>
            <ColorSchemeSwitcher />
          </Group>
        </Group>
      </Container>
    </Box>
  );
};

export default AppHeader;
