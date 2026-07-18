import { IconMenu2 } from "@tabler/icons-react";
import { to } from "../../routes/paths";
import { useAppMediaQueries } from "../../utils/useMediaQuery";
import { ColorSchemeSwitcher } from "../ColorSchemeSwitcher/ColorSchemeSwitcher";
import { Box } from "../Core/Box";
import { Button } from "../Core/Button";
import { Container } from "../Core/Container";
import { Group } from "../Core/Group";
import AppLogo from "./AppLogo";
import { useAppState } from "../../utils/useAppState";

const AppHeader = () => {
  const { isMobile } = useAppMediaQueries();
  const { toggleMobile } = useAppState();
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
          {isMobile ? (
            <Group>
              <Button
                className="Mobile-trigger"
                variant="subtle"
                color="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  toggleMobile();
                }}
              >
                <IconMenu2 />                
              </Button>
            </Group>
          ) : (
          <Group alignItems="center">
            <Group component="nav" className="Header-nav">
              <a href={to.about()}>About</a>
              <a href={to.posts()}>Posts</a>
              <a href={to.contact()}>Contact</a>
            </Group>
            <ColorSchemeSwitcher />
            </Group>
          )}
        </Group>
      </Container>
    </Box>
  );
};

export default AppHeader;
