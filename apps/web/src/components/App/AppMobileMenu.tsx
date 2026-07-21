import { IconX } from "@tabler/icons-react";
import { useAppMediaQueries } from "../../utils/useMediaQuery";
import { Box } from "../Core/Box";
import { Button } from "../Core/Button";
import { Container } from "../Core/Container"
import { Stack } from "../Core/Stack"
import AppLogo from "./AppLogo";
import { to } from "../../routes/paths";
import { Group } from "../Core/Group";
import { ColorSchemeSwitcher } from "../ColorSchemeSwitcher/ColorSchemeSwitcher";
import { useAppState } from "../../utils/useAppState";
import { classNames } from "../../utils/components/attributes";

const AppMobileMenu = () => {
  const { mobileOpened, closeMobile } = useAppState();
  const { isMobile } = useAppMediaQueries();
  return isMobile && (
    <Box className={classNames([
      "MobileMenu-root",
      mobileOpened ? 'MobileMenu-opened' : 'MobileMenu-closed'
    ])}>
      <Box className="MobileMenu-header">
        <Container>
          <Group justifyContent="space-between" alignItems="center">
            <AppLogo />
            <Group>
              <ColorSchemeSwitcher />
              <Button
                className="MobileMenu-close"
                variant="subtle"
                color="secondary"
                onClick={closeMobile}
              >
                <IconX size={24} />
              </Button>
            </Group>
          </Group>
          
        </Container>
      </Box>
      <Box className="MobileMenu-content">
        <Container>
          <Stack>
            <a href={to.about()}>About</a>
            <a href={to.posts()}>Posts</a>
            <a href={to.contact()}>Contact</a>
          </Stack>
          <hr/>
        </Container>
      </Box>
    </Box>
  )
}

export default AppMobileMenu;
