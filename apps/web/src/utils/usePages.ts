import { useEffect, useMemo, useState } from "react";
import { type PageEntity } from "../../../shared/types"

type PageResponse = PageEntity | null;

type PagesResponse = {
  slugs: string[];
}

type UsePagesReturnHelpers = {
  loading: boolean;
  fetchBySlug: (slug: string) => Promise<PageEntity | null>;
  refetch: () => Promise<void>;
}

type UsePagesReturnType = [
  PageEntity[],
  UsePagesReturnHelpers
];

export const usePages = (): UsePagesReturnType => {
  const [loading, setLoading] = useState<boolean>(true);
  const [slugs, setSlugs] = useState<string[]>([]);
  const [data, setData] = useState<PageEntity[]>([]);
  const refetch = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pages");
      const data: PagesResponse = await response.json();
      setSlugs(data.slugs);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBySlug = async (slug: string): Promise<PageEntity | null> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/pages/${slug}`);
      const responseData: PageResponse = await response.json();
      setData((prevData) => {
        if (responseData) {
          const exists = prevData.find((page) => page.slug === slug);
          if (exists) {
            return prevData;
          }
          return [...prevData, responseData];
        }
        return prevData;
      });
      return responseData;
    } catch (error) {
      console.error("Failed to fetch pages:", error);
    } finally {
      setLoading(false);
    }
    return null;
  };

  const mergedData = useMemo(() => {
    return slugs.map((slug) => {
      const page = data.find((t) => t.slug === slug);
      return {
        slug,
        page_title: slug,
        page_description: "",
        sidebar: 'default',
        ...page,
      } as PageEntity;
    });
  }, [slugs, data]);

  // Initial fetch
  useEffect(() => {
    void refetch();
  }, []);

  return [mergedData, {
    loading,
    refetch,
    fetchBySlug,
  }];
}
