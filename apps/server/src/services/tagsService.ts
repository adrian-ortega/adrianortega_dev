import { slugify } from "../../../shared";
import { ENTITY_TYPE, TagEntity } from "../../../shared/types";
import { getEntityBySlug, getFiles } from "./mdService";

export async function listTagSlugs(): Promise<string[]> {
  const files = getFiles(ENTITY_TYPE.TAG);
  const slugs = files.map((file) => slugify(file.replace(`tag.`, "").replace(".md", "")));
  return slugs;
}

export async function readTagFile(slug: string): Promise<TagEntity> {
  const tag = await getEntityBySlug<TagEntity>(ENTITY_TYPE.TAG, slug);
  if (!tag) {
    throw new Error(`Tag not found`);
  }
  return tag;
}
