import type { BoxProps } from "../Core/Box";
import { MarkdownContentComponentRenderer } from "./MarkdownContentComponentRenderer";

const SHORTCODE_REGEX = /\{\{\s*([\w]+)([\s\S]*?)\s*\}\}/g;

const parseProps = (rawProps: string) => {
  const props: Record<string, unknown> = {};
  rawProps
    .replace(/[‘’]/g, "'") // Single quotes
    .replace(/[“”]/g, '"') // Double quotes
    .trim()
    .match(/(\w+)=(".*?"|'.*?'|\[.*?\]|\{.*?\})/gs)
    ?.forEach((attr) => {
      const [key, value] = attr.split("=");
      let parsedValue = value.trim().replace(/^['"]|['"]$/g, "");
      if (/^\[|\{/.test(parsedValue)) {
        try {
          parsedValue = JSON.parse(parsedValue.replace(/'/g, '"')); // Convert to valid JSON
        } catch {
          console.error("Invalid JSON in markdown shortcode:", parsedValue);
        }
      }

      props[key] = parsedValue;
    });
  return props;
};

const parseShortcodes = (content: string) => {
  return content.replace(SHORTCODE_REGEX, (_, componentName, rawProps) => {
    const propsObject = parseProps(rawProps);
    return `<div data-component="${componentName}" data-props='${JSON.stringify(
      propsObject
    )}'></div>`;
  });
};

type MarkdownContentProps = BoxProps & {
  content: string;
};

export function MarkdownContent({ content, ...rendererProps }: MarkdownContentProps) {
  return (
    <MarkdownContentComponentRenderer content={parseShortcodes(content)} {...rendererProps} />
  )
}
