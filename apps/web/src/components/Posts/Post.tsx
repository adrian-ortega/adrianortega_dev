import { useNavigate, useParams } from "react-router";
import { Box } from "../Core/Box";
import { Container } from "../Core/Container";
import { useEffect, useMemo } from "react";
import { usePosts } from "../../utils/usePosts";
import { MarkdownContent } from "../MarkdownContent/MarkdownContent";
import { to } from "../../routes/paths";
import { PostTags } from "./PostTags";
import { PostNav } from "./PostNav";
import { RelatedPosts } from "./RelatedPosts";
import type { PostDetail } from "../../../../shared/types";
import { format } from "date-fns";
import { Group } from "../Core/Group";
import { IconCircleFilled } from "@tabler/icons-react";
import { Loading } from "../Core/Loading";
import { useAppMediaQueries } from "../../utils/useMediaQuery";
import { Stack } from "../Core/Stack";

export function Post() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { isMobile } = useAppMediaQueries();
  const [posts, { loading, fetchBySlug }] = usePosts();
  const post = useMemo(() => posts.find((p) => p.slug === slug), [posts, slug]);

  const publishedAt = !loading && post ? <Box className="Post-published">
    {format(post?.created_at as string, "PP pp")}
  </Box> : null;

  const postTags = !loading && post ? <PostTags post={post} /> : null;

  useEffect(() => {
    console.log('slug from useEffect', slug, 'post', post)
    if (slug) {
      console.log('fetching post by slug', slug, 'post', post)
      fetchBySlug(slug as string).catch(() => {
        console.log('post not found, navigating to notFound', 'post', post)
        navigate(to.notFound());
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return loading ? (
    <>
      <title>Loading... - Adrian Ortega</title>
      <Loading />
    </>
  ) : (
    <>
      <title>{post ? post.title : "Post Component"} - Adrian Ortega</title>
      <Box component="article" className="Post-root">
        <Container>
          <Box component="header" className="Post-header">
            <h1 className="Post-title">
              {post ? post.title : "Post Component"}
            </h1>
            {isMobile ? (
              <Stack alignItems="center">
                {publishedAt}
                {postTags}
              </Stack>
            ) : (

              <Group alignItems="center">
                {publishedAt}
                <IconCircleFilled size={4} color="var(--colors-primary-7)" />
                {postTags}
              </Group>
            )}
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
          <PostNav navigation={(post as PostDetail | undefined)?.navigation} />
          <RelatedPosts slug={slug} />
        </Container>
      </Box>
    </>
  );
}
