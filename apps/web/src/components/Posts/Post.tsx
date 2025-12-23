import { useNavigate, useParams } from "react-router";
import { Box } from "../Core/Box";
import { Container } from "../Core/Container";
import { useEffect, useMemo } from "react";
import { usePosts } from "../../utils/usePosts";
import { MarkdownContent } from "../MarkdownContent/MarkdownContent";
import { to } from "../../routes/paths";

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
      <Container>
        <h1>Loading...</h1>
      </Container>
    </Box>
  ) : (
    <Box className="Post-root">
      <Container>
        <h1>{post ? post.title : "Post Component"}</h1>
        <MarkdownContent content={post ? post.content : ""} />
      </Container>
    </Box>
  );
}
