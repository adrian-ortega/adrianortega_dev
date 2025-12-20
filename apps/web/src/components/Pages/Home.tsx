import { usePosts } from "../../utils/usePosts";
import { Box } from "../Core/Box";
import { Container } from "../Core/Container";
import { PostPreview } from "../Posts/PostPreview";

export function HomePage() {
  const [posts, { loading }] = usePosts();
  return (
    <Box className="Home-root">
      <Container style={{ paddingTop: 32, paddingBottom: 32 }}>
        {loading ? (
          <Box>Loading...</Box>
        ) : (
          posts.map((post) => (
            <PostPreview key={post.id} post={post} />
          ))
        )}
      </Container>
    </Box>
  );
}
