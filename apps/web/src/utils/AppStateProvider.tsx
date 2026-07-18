import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AppStateContext,
  type AppThemeColors,
  type AppStateBaseContext,
  type AppStateColorScheme,
  type AppTheme,
  type AppThemeSchemeTupleItem,
  createAppThemeColors,
  lightDarkColor,
} from "./useAppState";
import useDisclosure from "./useDisclosure";

interface AppStateProviderProps {
  children: ReactNode;
}

export const AppStateProvider = ({ children }: AppStateProviderProps) => {

  // Theme and scheme
  const isOsDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedColorScheme = window.localStorage?.getItem(
    "color-scheme"
  ) as AppStateColorScheme | null;
  const [colorScheme, _setColorScheme] = useState<AppStateColorScheme>(
    savedColorScheme || (isOsDarkMode ? "dark" : "light")
  );
  const toggleBodyColorSchemeClass = useCallback(
    (scheme: AppStateColorScheme) => {
      window.document.body.classList.remove(`${colorScheme}-mode`);
      window.document.body.classList.add(`${scheme}-mode`);
      if (window.localStorage) {
        window.localStorage.setItem("color-scheme", scheme);
      }
    },
    [colorScheme]
  );

  const setColorScheme = useCallback(
    (scheme: AppStateColorScheme) => {
      _setColorScheme(scheme);
      toggleBodyColorSchemeClass(scheme);
    },
    [toggleBodyColorSchemeClass]
  );

  const [themeColors, _setThemeColors] = useState<AppThemeColors>(createAppThemeColors({
    primary: [
      lightDarkColor("#f7f3f2", "#F3F5F0"),
      lightDarkColor("#e8e6e5", "#E7EAE1"),
      lightDarkColor("#d2c9c6", "#CFD5C3"),
      lightDarkColor("#bdaaa4", "#B7C0A5"),
      lightDarkColor("#ab9087", "#9FAB87"),
      lightDarkColor("#a17f74", "#879669"),
      lightDarkColor("#9d766a", "#6C7854"),
      lightDarkColor("#896459", "#515A3F"),
      lightDarkColor("#7b594e", "#363C2A"),
      lightDarkColor("#5d4037", "#1B1E15"),
    ],
    gray: [
      "#f5f6f4",
      "#e9e9e9",
      "#d0d2cf",
      "#b6b9b1",
      "#a0a498",
      "#919787",
      "#777d6b",
      "#696f5e",
      "#34382d",
      "#2a2d24",
    ],
    blue: [
      "#ecf4ff",
      "#dce4f5",
      "#b9c7e2",
      "#94a8d0",
      "#748dc0",
      "#5f7cb7",
      "#5474b4",
      "#44639f",
      "#3a5890",
      "#2c4b80"
    ],
    dark: [
      "#E3E8E8",
      "#C7D1D1",
      "#ACB9B9",
      "#90A2A2",
      "#748B8B",
      "#5D6F6F",
      "#465353",
      "#2E3838",
      "#171C1C",
      "#101313",
    ],
    green: [
      "#f2f8f4",
      "#e4ede7",
      "#c5dacc",
      "#a2c7ae",
      "#85b795",
      "#73ac85",
      "#68a87c",
      "#57926a",
      "#4b825d",
      "#2d543a"
    ],
    orange: [
      "#fff5e8",
      "#f8e8d6",
      "#f0d0ac",
      "#e8b67e",
      "#e1a057",
      "#dd923e",
      "#db8a30",
      "#c27723",
      "#ad691c",
      "#975a11"
    ],
    pink: [
      "#f8f1f8",
      "#ece1eb",
      "#d9bfd8",
      "#c69bc5",
      "#b67db4",
      "#ac6aaa",
      "#a860a6",
      "#935091",
      "#834681",
      "#4f284e"
    ],
    red: [
      "#faf1f0",
      "#eddfde",
      "#debbb8",
      "#d09590",
      "#c4756d",
      "#bd6157",
      "#bb564b",
      "#a5473d",
      "#933e35",
      "#5c241f"
    ],
    yellow: [
      "#fffae1",
      "#fdf3ce",
      "#f8e5a0",
      "#f4d76e",
      "#f0ca41",
      "#eec329",
      "#edbf17",
      "#d3a806",
      "#bb9500",
      "#a28000",
    ],
  }));
  const setThemeColors = useCallback(
    (colors: AppThemeColors) => {
      _setThemeColors(createAppThemeColors(colors))
    },
    []
  );
  const theme = useMemo<AppTheme>(() => ({ colors: themeColors }), [themeColors]);

  // Mobile toggles
  const [mobileOpened, { open: openMobile, close: closeMobile, toggle: toggleMobile }] = useDisclosure();

  const api = useMemo<AppStateBaseContext>(
    () => ({
      colorScheme,
      mobileOpened,
      openMobile,
      closeMobile,
      toggleMobile,
      setColorScheme,
      setThemeColors,
      theme,
    }),
    [
      colorScheme,
      setColorScheme,
      setThemeColors,
      theme,
      mobileOpened,
      openMobile,
      closeMobile,
      toggleMobile,
    ]
  );

  window.document.body.classList.add(`${colorScheme}-mode`);

  useEffect(() => {
    if (document.getElementById('AppStyles')) {
      document.getElementById("AppStyles")?.remove();
    }

    const appStyles = document.createElement('style');
    appStyles.id = "AppStyles";

    const colorEntries = Object.entries(theme.colors);
    const colorvars = colorEntries.map(([color, tuple]) =>
      tuple.map((tupleItem: AppThemeSchemeTupleItem, i) => `--colors-${color}-${i}: ${tupleItem[colorScheme]}`)
    )
      .reduce((colors, color) => ([...colors, ...color]), [])
      .join(';')

    appStyles.innerHTML = `:root { 
      ${colorvars}
    }`
    document.head.appendChild(appStyles);

    return () => {
      document.getElementById("AppStyles")?.remove();
    }
  }, [theme.colors, colorScheme])

  return (
    <AppStateContext.Provider value={api}>{children}</AppStateContext.Provider>
  );
};
