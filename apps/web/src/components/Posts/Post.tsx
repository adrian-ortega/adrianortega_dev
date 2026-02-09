import { useNavigate, useParams } from "react-router";
import { Box } from "../Core/Box";
import { Container } from "../Core/Container";
import { useEffect, useMemo } from "react";
import { usePosts } from "../../utils/usePosts";
import { MarkdownContent } from "../MarkdownContent/MarkdownContent";
import { to } from "../../routes/paths";
import { PostTags } from "./PostTags";
import { format } from "date-fns";
import { Group } from "../Core/Group";
import { IconCircleFilled } from "@tabler/icons-react";

export function Post() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [posts, { loading, fetchBySlug }] = usePosts();
  const post = useMemo(() => posts.find((p) => p.slug === slug), [posts, slug]);

  useEffect(() => {
    if (slug) {
      fetchBySlug(slug as string).catch(() => {
        navigate(to.notFound());
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return loading ? (
    <Box className="Post-root">
      <title>Loading... - Adrian Ortega</title>
      <Container>
        <h1>Loading...</h1>
      </Container>
    </Box>
  ) : (
    <Box className="Post-root">
      <Container>
        <Box className="Post-header">
          <h1 className="Post-title">{post ? post.title : "Post Component"}</h1>
          <Group alignItems="center">
            <Box className="Post-published">
              {format(post?.created_at as string, "PP pp")}
            </Box>
            <IconCircleFilled size={4} color="var(--colors-primary-7)" />
            <PostTags post={post!} />
          </Group>
          {post?.cover_image && (
            <Box className="Post-cover">
              <img src={post.cover_image} alt={post.title} />
              <Box
                className="Post-coverBg"
                style={{
                  backgroundImage: `url(${post.cover_image})`,
                }}
              />
            </Box>
          )}
        </Box>
        <MarkdownContent content={post ? post.content : ""} />
      </Container>
    </Box>
  );
}
