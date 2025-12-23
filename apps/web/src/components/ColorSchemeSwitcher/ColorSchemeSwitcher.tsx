import { useAppState } from "../../utils/useAppState";
import { Box } from "../Core/Box";
import { IconMoonFilled, IconSunFilled } from "@tabler/icons-react";

export function ColorSchemeSwitcher() {
  const { colorScheme, setColorScheme, theme } = useAppState();
  const handleSwitch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const newScheme = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(newScheme);
  }

  return (
    <Box className="ColorSchemeSwitcher-root">
      <button
        className="ColorSchemeSwitcher-button"
        onClick={handleSwitch}
        title={`Switch to ${colorScheme === "dark" ? "light" : "dark"} mode`}
      >
        <span>
          {colorScheme === "light" && <IconMoonFilled color={theme.colors.dark[6]} />}
          {colorScheme === "dark" && <IconSunFilled color={theme.colors.yellow[6]} />}
        </span>
      </button>
    </Box>
  );
}
