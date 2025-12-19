import { ENTITY_TYPE } from './../types';
import { PageEntity } from "../types";
import { getEntityBySlug, getFiles } from "./mdService";
import { slugify } from '../../../shared';

export async function listPageSlugs(): Promise<string[]> {
  const files = getFiles(ENTITY_TYPE.PAGE);
  const slugs = files.map((file) => slugify(file.replace(`page.`, "").replace(".md", "")));
  return slugs;
}

export async function readPageFile(slug: string): Promise<PageEntity> {
  const page = await getEntityBySlug<PageEntity>(ENTITY_TYPE.PAGE, slug);
  if (!page) {
    throw new Error(`Page not found`);
  }
  return page;
}
