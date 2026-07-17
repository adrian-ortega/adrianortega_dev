import { Box, type BoxProps } from "../Core/Box";

type MarkdownContentComponentRendererProps = BoxProps & {
  content: string;
};

export function MarkdownContentComponentRenderer({ content, ...boxProps }: MarkdownContentComponentRendererProps) {
  // This is a placeholder implementation.
  // The actual implementation would parse the content and render components based on the data attributes.
  return (
    <Box
      className="Content-root"
      dangerouslySetInnerHTML={{ __html: content }}
      {...boxProps}
    />
  );
}
