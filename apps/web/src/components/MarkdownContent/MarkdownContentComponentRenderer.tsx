export function MarkdownContentComponentRenderer({ content }: { content: string }) {
  // This is a placeholder implementation.
  // The actual implementation would parse the content and render components based on the data attributes.
  return (
    <div
      className="Content-root"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
