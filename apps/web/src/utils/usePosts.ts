import { useState } from "react";
import { type PostEntity } from "../../../shared/types";

type PostResponse = PostEntity | null;

type PostsResponse = {
  error?: string;
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
    setData([]);
    const response = await fetch(tag ? `/api/posts?tag=${tag}` : "/api/posts");
    const data: PostsResponse = await response.json();
    if (data?.error) {
      setLoading(false);
      throw new Error(data.error);
    }
    setData([...data.posts]);
    setLoading(false);
  };

  const fetchBySlug = async (slug: string): Promise<PostEntity | null> => {
    setLoading(true);
    const response = await fetch(`/api/posts/${slug}`);
    const responseData: PostResponse = await response.json();
    if (responseData?.error) {
      setLoading(false);
      throw new Error(responseData.error);
    }
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
    setLoading(false);
    return responseData;
  };

  return [ data, {
      loading,
      refetch,
      fetchBySlug
  } ];
}
