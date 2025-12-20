import { useEffect, useState } from "react";
import { type PostEntity } from "../../../shared/types";

type PostResponse = PostEntity | null;

type PostsResponse = {
  posts: PostEntity[];
}

type UsePostsReturnHelpers = {
  loading: boolean;
  refetch: (tag?: string) => Promise<void>;
  fetchBySlug: (slug: string) => Promise<PostEntity | null>;
}

type UsePostsReturnType = [
  PostEntity[],
  UsePostsReturnHelpers
];

export function usePosts(): UsePostsReturnType {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<PostEntity[]>([]);

  const refetch = async (tag?: string) => {
    setLoading(true);
    try {
      const response = await fetch(tag ? `/api/posts?tag=${tag}` : "/api/posts");
      const data: PostsResponse = await response.json();
      setData([...data.posts]);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBySlug = async (slug: string): Promise<PostEntity | null> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${slug}`);
      const responseData: PostResponse = await response.json();
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
      console.error("Failed to fetch post:", error);
    } finally {
      setLoading(false);
    }
    return null;
  };

  // Initial fetch
  useEffect(() => {
    void refetch();
  }, []);

  return [ data, {
      loading,
      refetch,
      fetchBySlug
  } ];
}
