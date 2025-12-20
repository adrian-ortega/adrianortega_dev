import { useEffect, useMemo, useState } from "react";
import { type TagEntity } from "../../../shared/types"

type TagResponse = TagEntity | null;

type TagsResponse = {
  slugs: string[];
}

type UseTagsReturnHelpers = {
  loading: boolean;
  fetchBySlug: (slug: string) => Promise<TagEntity | null>;
  refetch: () => Promise<void>;
}

type UseTagsReturnType = [
  TagEntity[],
  UseTagsReturnHelpers
];

export const useTags = (): UseTagsReturnType => {
  const [loading, setLoading] = useState<boolean>(true);
  const [slugs, setSlugs] = useState<string[]>([]);
  const [data, setData] = useState<TagEntity[]>([]);
  const refetch = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/tags");
      const data: TagsResponse = await response.json();
      setSlugs(data.slugs);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBySlug = async (slug: string): Promise<TagEntity | null> => {
    try {
      const response = await fetch(`/api/tags/${slug}`);
      const responseData: TagResponse = await response.json();
      setData((prevData) => {
        if (responseData) {
          const exists = prevData.find((tag) => tag.slug === slug);
          if (exists) {
            return prevData;
          }
          return [...prevData, responseData];
        }
        return prevData;
      });
      return responseData;
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
    return null;
  };

  const mergedData = useMemo(() => {
    return slugs.map((slug) => {
      const tag = data.find((t) => t.slug === slug);
      return {
        slug,
        name: slug,
        ...tag,
      } as TagEntity;
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
