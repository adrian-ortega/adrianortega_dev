import MarkdownPrism from "markdown-it-prism";
import MarkdownIt from "markdown-it";

const markdownIt = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
}).use(MarkdownPrism);

export const parseMarkdown = (content: string) => {
  return markdownIt.render(content.trim());
};
