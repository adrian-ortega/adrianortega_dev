// Minimal frontmatter parser.
//
// Expected format:
// ---
// title: Hello
// tags: a, b, c
// ---
// # Markdown here
//
// This intentionally avoids YAML dependencies while you're bootstrapping.
// If/when you want full YAML support, swap this for `gray-matter`.

export function parseFrontmatter(input: string): {
  meta: Record<string, unknown>;
  content: string;
} {
  const trimmed = input ?? "";
  if (!trimmed.startsWith("---\n") && !trimmed.startsWith("---\r\n")) {
    return { meta: {}, content: input };
  }

  // Find the closing --- on its own line
  const lines = trimmed.split(/\r?\n/);
  // lines[0] is ---
  let endIndex = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === "---") {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) {
    // Malformed frontmatter; treat as plain markdown
    return { meta: {}, content: input };
  }

  const metaLines = lines.slice(1, endIndex);
  const contentLines = lines.slice(endIndex + 1);

  const meta: Record<string, unknown> = {};
  for (const line of metaLines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const valueRaw = line.slice(idx + 1).trim();
    if (!key) continue;

    // Basic conveniences
    if (valueRaw.includes(",")) {
      meta[key] = valueRaw
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    } else if (valueRaw === "true") {
      meta[key] = true;
    } else if (valueRaw === "false") {
      meta[key] = false;
    } else if (!Number.isNaN(Number(valueRaw)) && valueRaw !== "") {
      // Only coerce if it's a clean number string
      meta[key] = Number(valueRaw);
    } else {
      meta[key] = valueRaw;
    }
  }

  return {
    meta,
    content: contentLines.join("\n").replace(/^\n+/, ""),
  };
}
