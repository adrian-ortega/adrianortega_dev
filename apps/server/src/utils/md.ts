import MarkdownPrism from "markdown-it-prism";
import MarkdownIt from "markdown-it";
import { rewriteAssetUrls } from "./rewriteAssetUrls";

const markdownIt = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
}).use(MarkdownPrism);

export const parseMarkdown = (content: string) => {
  const html = markdownIt.render(content.trim());
  return rewriteAssetUrls(html);
};
