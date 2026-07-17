import { createContext, useContext } from "react";

export type AppStateColorScheme = 'light' | 'dark';
export type AppThemeTupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : AppThemeTupleOf<T, N, [T, ...R]>;
export type AppThemeTuple<T, N extends number> = N extends N ? (number extends N ? T[] : AppThemeTupleOf<T, N, []>) : never; 
export type AppThemeSingleTuple = AppThemeTuple<string, 10>;
export type AppThemeSchemeTupleItem = { light?: string, dark?: string };
export type AppThemeSchemeTuple = AppThemeTuple<AppThemeSchemeTupleItem, 10>
export type AppThemeColors = Record<string, AppThemeSingleTuple|AppThemeSchemeTuple>;
export type AppTheme = {
  colors: AppThemeColors; 
}

export type AppStateBaseContext = {
  theme: AppTheme;
  colorScheme: AppStateColorScheme;
  setColorScheme: (scheme: AppStateColorScheme) => void;
  setThemeColors: (colors: AppThemeColors) => void;
}

export const AppStateContext = createContext<AppStateBaseContext>(
  {} as AppStateBaseContext
);

export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return ctx;
}

export const lightDarkColor = (light: string, dark?: string): AppThemeSchemeTupleItem => ({
  light,
  dark: dark ?? light
}) as AppThemeSchemeTupleItem;

export const createAppThemeColors = (colors: AppThemeColors): Record<string, AppThemeSchemeTuple> => {
  const oldThemeColors = { ...colors };
  const createSchemeTuple = (tuple: AppThemeSingleTuple | AppThemeSchemeTuple): AppThemeSchemeTuple => {
    return [...tuple].map((tupleItem) => {
      if (typeof tupleItem === "string") {
        return { light: tupleItem, dark: tupleItem }
      }
      return tupleItem;
    }) as AppThemeSchemeTuple
  }
  return Object.fromEntries(
    Object.entries(oldThemeColors).map(([c, t]) => ([c, createSchemeTuple(t)]))
  );
}
