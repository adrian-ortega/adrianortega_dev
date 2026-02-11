import { useNavigate } from "react-router";
import { Box } from "../Core/Box";
import { usePages } from "../../utils/usePages";
import { useEffect, useState } from "react";
import { type PageEntity } from "../../../../shared/types";
import { MarkdownContent } from "../MarkdownContent/MarkdownContent";
import { ContactForm } from "../Contact/ContactForm";
import { Container } from "../Core/Container";

export function ContactPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState<PageEntity | undefined>();
  const [, { fetchBySlug }] = usePages();

  useEffect(() => {
    fetchBySlug("contact")
      .then((data) => {
        setPage(data || undefined);
      })
      .catch(() => {
        navigate("/not-found");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <title>Contact - Adrian Ortega</title>
      <Box className="Contact-root">
        <Container maxWidth="sm">
          <MarkdownContent
            className="Contact-content"
            content={page ? page.content : "Loading..."}
            style={{ flex: 1 }}
          />
          <ContactForm />
        </Container>
      </Box>
    </>
  );
}
