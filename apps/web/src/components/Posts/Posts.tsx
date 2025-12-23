import { useEffect } from "react";
import { usePosts } from "../../utils/usePosts";
import { Box } from "../Core/Box";
import { Container } from "../Core/Container";
import { Stack } from "../Core/Stack";
import { PostPreview } from "./PostPreview";
import { useNavigate } from "react-router";
import { to } from "../../routes/paths";

type PostsProps = {
  tag?: string;
}

const Posts = ({ tag }: PostsProps) => {
  const navigate = useNavigate();
  const [posts, { loading, refetch }] = usePosts();

  useEffect(() => {
    refetch(tag as string).catch(() => {
      navigate(to.notFound());
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tag])
  return (
    <Box className="Posts-root">
      <Container>
        {loading ? (
          <Box>Loading...</Box>
        ) : (
          <Stack gap={64}>
            {posts.map((post) => (
              <PostPreview key={`post-${post.slug}`} post={post} />
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default Posts;
