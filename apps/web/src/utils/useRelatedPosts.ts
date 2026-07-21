import { useCallback, useEffect, useState } from "react";
import type { RelatedPost } from "../../../shared/types";

type UseRelatedPostsReturnType = {
  posts: RelatedPost[];
  loading: boolean;
};

export function useRelatedPosts(
  slug: string | undefined,
  limit = 3,
): UseRelatedPostsReturnType {
  const [posts, setPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRelatedPosts = useCallback(async (_slug: string, cancelled: () => boolean) => {
    fetch(`/api/posts/${slug}/related?limit=${limit}`)
      .then((response) => (response.ok ? response.json() : { posts: [] }))
      .then((data) => {
        if (!cancelled()) setPosts(data.posts ?? []);
      })
      .catch(() => {
        if (!cancelled()) setPosts([]);
      })
      .finally(() => {
        if (!cancelled()) setLoading(false);
      });
  }, [slug, limit]);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    fetchRelatedPosts(slug, () => cancelled);
    return () => {
      cancelled = true;
    };
  }, [slug, limit, fetchRelatedPosts]);

  return { posts, loading };
}
