import { useEffect, useMemo, useState } from "react";
import type { MdEntity } from "../../../shared/types";

type EntityHookHelpers<T> = {
  loading: boolean;
  fetchBySlug: (slug: string) => Promise<T | null>;
};

type EntityHookReturn<T> = [T[], EntityHookHelpers<T>];

/**
 * Factory for hooks that fetch a single entity by slug on demand.
 * Handles loading state and deduplication.
 *
 * Usage:
 *   export const useWidgets = makeEntityHook<WidgetEntity>("/api/widgets");
 */
export function makeEntityHook<T extends MdEntity>(
  endpoint: string,
): () => EntityHookReturn<T> {
  return function useEntityHook(): EntityHookReturn<T> {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<T[]>([]);

    const fetchBySlug = async (slug: string): Promise<T | null> => {
      setLoading(true);
      try {
        const response = await fetch(`${endpoint}/${slug}`);
        const responseData: T | null = await response.json();
        setData((prev) => {
          if (!responseData) return prev;
          if (prev.find((e) => e.slug === slug)) return prev;
          return [...prev, responseData];
        });
        return responseData;
      } catch (error) {
        console.error(`Failed to fetch ${endpoint}/${slug}:`, error);
        return null;
      } finally {
        setLoading(false);
      }
    };

    return [data, { loading, fetchBySlug }];
  };
}

type SlugListHookHelpers<T> = {
  loading: boolean;
  fetchBySlug: (slug: string) => Promise<T | null>;
  refetch: () => Promise<void>;
};

type SlugListHookReturn<T> = [T[], SlugListHookHelpers<T>];

/**
 * Factory for hooks that first fetch a list of slugs, then lazy-load
 * individual entities by slug and merge them with a placeholder default.
 *
 * Usage:
 *   export const usePages = makeSlugListHook<PageEntity>(
 *     "/api/pages",
 *     (slug) => ({ slug, page_title: slug, page_description: "", sidebar: "default" }),
 *   );
 */
export function makeSlugListHook<T extends MdEntity>(
  endpoint: string,
  makeDefaults: (slug: string) => Partial<T>,
): () => SlugListHookReturn<T> {
  return function useSlugListHook(): SlugListHookReturn<T> {
    const [loading, setLoading] = useState(true);
    const [slugs, setSlugs] = useState<string[]>([]);
    const [data, setData] = useState<T[]>([]);

    const refetch = async () => {
      setLoading(true);
      try {
        const response = await fetch(endpoint);
        const json: { slugs: string[] } = await response.json();
        setSlugs(json.slugs);
      } catch (error) {
        console.error(`Failed to fetch ${endpoint}:`, error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBySlug = async (slug: string): Promise<T | null> => {
      try {
        const response = await fetch(`${endpoint}/${slug}`);
        const responseData: T | null = await response.json();
        setData((prev) => {
          if (!responseData) return prev;
          if (prev.find((e) => e.slug === slug)) return prev;
          return [...prev, responseData];
        });
        return responseData;
      } catch (error) {
        console.error(`Failed to fetch ${endpoint}/${slug}:`, error);
        return null;
      }
    };

    const mergedData = useMemo(
      () => slugs.map((slug) => ({ ...makeDefaults(slug), ...data.find((e) => e.slug === slug) } as T)),
      [slugs, data],
    );

    useEffect(() => { void refetch(); }, []);

    return [mergedData, { loading, fetchBySlug, refetch }];
  };
}
