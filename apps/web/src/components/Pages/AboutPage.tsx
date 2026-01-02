import { useNavigate } from "react-router";
import { Box } from "../Core/Box";
import { usePages } from "../../utils/usePages";
import { useEffect, useState } from "react";
import { type PageEntity } from "../../../../shared/types";
import { MarkdownContent } from "../MarkdownContent/MarkdownContent";

export function AboutPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState<PageEntity | undefined>();
  const [, { fetchBySlug }] = usePages();

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

  return (
    <Box className="About-root">
      <MarkdownContent content={page ? page.content : "Loading..."} />
    </Box>
  );
}
