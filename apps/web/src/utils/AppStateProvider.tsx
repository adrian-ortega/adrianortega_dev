import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
  AppStateContext,
  type AppStateBaseContext,
  type AppStateColorScheme,
  type AppTheme,
} from "./useAppState";

interface AppStateProviderProps {
  children: ReactNode;
}

export const AppStateProvider = ({ children }: AppStateProviderProps) => {
  const savedColorScheme = window.localStorage?.getItem(
    "color-scheme"
  ) as AppStateColorScheme | null;
  const [colorScheme, _setColorScheme] = useState<AppStateColorScheme>(
    savedColorScheme || "light"
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

  const theme = useMemo<AppTheme>(
    () => ({
      colors: {
        gray: [
          "#f1f4fe",
          "#e4e6ed",
          "#c8cad3",
          "#a9adb9",
          "#9094a3",
          "#7f8496",
          "#777c91",
          "#63687c",
          "#595e72",
          "#4a5167",
        ],
        dark: [
          "#ecefff",
          "#d5dafb",
          "#a9b1f1",
          "#7a87e9",
          "#5362e1",
          "#3a4bdd",
          "#2c40dc",
          "#1f32c4",
          "#182cb0",
          "#0a259c",
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
      },
    }),
    []
  );

  const api = useMemo<AppStateBaseContext>(
    () => ({
      colorScheme,
      setColorScheme,
      theme,
    }),
    [colorScheme, setColorScheme, theme]
  );

  window.document.body.classList.add(`${colorScheme}-mode`);

  return (
    <AppStateContext.Provider value={api}>{children}</AppStateContext.Provider>
  );
};
