import { useEffect, useState } from "react";
import { type PostEntity } from "../../../shared/types";

type PostsResponse = {
  posts: PostEntity[];
}

type UsePostsReturnHelpers = {
  loading: boolean;
  refetch: () => Promise<void>;
}

type UsePostsReturnType = [
  PostEntity[],
  UsePostsReturnHelpers
];

export function usePosts(): UsePostsReturnType {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<PostEntity[]>([]);

  const refetch = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/posts");
      const data: PostsResponse = await response.json();
      setData(data.posts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    void refetch();
  }, []);

  return [ data, {
      loading,
      refetch
  } ];
}
