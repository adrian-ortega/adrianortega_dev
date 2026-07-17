import { useNavigate } from "react-router";
import { Box } from "../Core/Box";
import { usePages } from "../../utils/usePages";
import { useEffect, useState } from "react";
import { type PageEntity } from "../../../../shared/types";
import { MarkdownContent } from "../MarkdownContent/MarkdownContent";
import { Loading } from "../Core/Loading";
import { Container } from "../Core/Container";

export function AboutPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState<PageEntity | undefined>();
  const [, { loading, fetchBySlug }] = usePages();

  useEffect(() => {
    fetchBySlug("about")
      .then((data) => {
        setPage(data || undefined);
      })
      .catch(() => {
        navigate("/not-found");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading ? (
    <>
      <title>Loading... - Adrian Ortega</title>
      <Loading />
    </>
  ) : (
    <Box className="About-root">
      <title>About - Adrian Ortega</title>
      <Container>
        <MarkdownContent content={page ? page.content : "Loading..."} />
      </Container>
    </Box>
  );
}
