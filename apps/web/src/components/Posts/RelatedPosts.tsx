import { Link } from "react-router";
import { format } from "date-fns";
import type { PostEntity } from "../../../../shared/types";
import { Box } from "../Core/Box";
import { to } from "../../routes/paths";
import { useRelatedPosts } from "../../utils/useRelatedPosts";
import { PostTags } from "./PostTags";

type RelatedPostsProps = {
  slug?: string;
  limit?: number;
  title?: string;
};

export function RelatedPosts({
  slug,
  limit = 3,
  title = "Related posts",
}: RelatedPostsProps) {
  const { posts, loading } = useRelatedPosts(slug, limit);

  // Appears once loaded; no spinner under the article body
  if (loading || posts.length === 0) return null;

  return (
    <Box component="aside" className="RelatedPosts-root">
      <h2 className="RelatedPosts-title">{title}</h2>
      <Box className="RelatedPosts-grid">
        {posts.map((post) => (
          <Box
            component="article"
            key={`related-${post.slug}`}
            className="RelatedPosts-card"
          >
            <h3 className="RelatedPosts-cardTitle">
              <Link to={to.post(post.slug)}>{post.title}</Link>
            </h3>
            {post.created_at && (
              <Box className="RelatedPosts-published">
                {format(post.created_at, "PP")}
              </Box>
            )}
            {post.description && (
              <p className="RelatedPosts-description">{post.description}</p>
            )}
            <PostTags
              className="RelatedPosts-tags"
              post={post as PostEntity}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
