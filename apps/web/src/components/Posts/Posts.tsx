import { useEffect } from "react";
import { usePosts } from "../../utils/usePosts";
import { Box } from "../Core/Box";
import { Container } from "../Core/Container";
import { Stack } from "../Core/Stack";
import { PostPreview } from "./PostPreview";
import { useNavigate } from "react-router";
import { to } from "../../routes/paths";
import { Loading } from "../Core/Loading";

type PostsProps = {
  tag?: string;
  showDetails?: boolean
}

const Posts = ({ tag, showDetails }: PostsProps) => {
  const navigate = useNavigate();
  const [posts, { loading, refetch, tag: tagEntity }] = usePosts();

  useEffect(() => {
    refetch(tag as string).catch(() => {
      navigate(to.notFound());
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tag])
  return (
    <>
      <title>Posts - Adrian Ortega</title>
      <Box className="Posts-root">
        <Container>
          {showDetails && (
            <Stack className="Posts-header" gap={64}>
              <h1 className="Posts-title">Posts under <span>{ tagEntity ? tagEntity?.name : tag }</span></h1>
            </Stack>
          )}
        </Container>
        <Container>
          {loading ? (
            <Loading />
          ) : (
            <Stack className="PostPreviews-root" gap={64}>
              {posts.map((post) => (
                <PostPreview key={`post-${post.slug}`} post={post} />
              ))}
            </Stack>
          )}
        </Container>
      </Box>
    </>
  );
};

export default Posts;
