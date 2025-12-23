import { createContext, useContext } from "react";

export type AppStateColorScheme = 'light' | 'dark';
export type AppThemeTupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : AppThemeTupleOf<T, N, [T, ...R]>;
export type AppThemeTuple<T, N extends number> = N extends N ? (number extends N ? T[] : AppThemeTupleOf<T, N, []>) : never; 
export type AppTheme = {
  colors: Record<string, AppThemeTuple<string, 10>>;
}

export type AppStateBaseContext = {
  theme: AppTheme;
  colorScheme: AppStateColorScheme;
  setColorScheme: (scheme: AppStateColorScheme) => void;
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
