const ASSET_REGEX =
  /(src|href)=["'](?:\/|\.\/|\.\.\/)?assets\/([^"']+)["']/gi;

export function rewriteAssetUrls(html: string): string {
  return html.replace(ASSET_REGEX, (_match, attr, path) => {
    return `${attr}="/content-assets/${path}"`;
  });
}
