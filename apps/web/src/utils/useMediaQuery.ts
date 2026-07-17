import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query and re-renders when it changes.
 * Mantine-like `useMediaQuery`, built on useSyncExternalStore so the
 * value is always consistent with the render (no stale-listener bugs).
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    // Server/prerender snapshot — no window, assume no match
    () => false,
  );
}

/**
 * App breakpoints. Keep in sync with the @media rules in src/styles/*.css,
 * which are mobile-first at 768px / 1024px / 1400px.
 */
export const breakpoints = {
  sm: "768px",
  md: "1024px",
  lg: "1400px",
} as const;

const min = (bp: string) => `(min-width: ${bp})`;
// Exclusive upper bound so e.g. exactly 768px wide counts as tablet, not mobile
const max = (bp: string) => `(max-width: ${parseFloat(bp) - 0.02}px)`;

type UseAppMediaQueriesReturnType = {
  isMobile: boolean;
  isTablet: boolean;
  isTouch: boolean;
  isDesktop: boolean;
};

/**
 * const { isMobile, isTablet, isTouch, isDesktop } = useAppMediaQueries();
 *
 * - isMobile:  < 768px
 * - isTablet:  768px – 1023px
 * - isTouch:   < 1024px (mobile or tablet)
 * - isDesktop: >= 1024px
 */
export function useAppMediaQueries(): UseAppMediaQueriesReturnType {
  const { sm, md } = breakpoints;
  const isMobile = useMediaQuery(max(sm));
  const isTablet = useMediaQuery(`${min(sm)} and ${max(md)}`);
  const isTouch = useMediaQuery(max(md));
  const isDesktop = useMediaQuery(min(md));

  return { isMobile, isTablet, isTouch, isDesktop };
}
