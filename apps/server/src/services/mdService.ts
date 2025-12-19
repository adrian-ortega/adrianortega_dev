import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { getContentDir } from "../utils/paths";
import { parseMarkdown } from "../utils/md";
import { slugify } from "../../../shared";
import { getFromCache, setInCache } from "./mdCacheService";
import { ENTITY_TYPE, MdEntity } from "../types";

enum DIR_MAP {
  POST = "posts",
  PAGE = "pages",
  TAG = "tags",
  NOTIFICATION = "notifications",
  WIDGET = "widgets",
  SIDEBAR = "sidebars",
}

export const getEntityDir = (entityType: ENTITY_TYPE): string => {
  return path.join(getContentDir(), DIR_MAP[entityType.toUpperCase() as keyof typeof DIR_MAP]);
}

export const getFiles = (entityType: ENTITY_TYPE): string[] => {
  let files: string[] = [];
  try {
    files = fs
      .readdirSync(getEntityDir(entityType))
      .filter((file) => path.extname(file) === ".md")
      .filter((file) => !file.includes("readme"));
  } catch {
    // Handle error
  }
  return files;
};

const defaultConverter = <T extends MdEntity>(file: string, entityType: ENTITY_TYPE): T => {
  const filePath = path.join(getEntityDir(entityType), file);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  return {
    ...data,
    slug: slugify(file.replace(`${entityType}.`, "").replace(".md", "")),
    content: parseMarkdown(content.trim()),
  } as T;
};


export const getEntities = async <T extends MdEntity>(
  entityType: ENTITY_TYPE,
  converters: ((entity: MdEntity) => T)[] = []
): Promise<T[] | null> => {
  let data: T[]|null = await getFromCache<T>(entityType);
  if (!data) {
    const files = getFiles(entityType);
    const entities = files.map((file) => defaultConverter<T>(file, entityType)) as T[];
    data = converters.reduce((acc, converter) => acc.map(converter), entities);
    await setInCache(entityType, data);
  }
  return data;
}

export const getEntityBySlug = async <T extends MdEntity>(
  entityType: ENTITY_TYPE,
  slug: string,
  converters: ((entity: MdEntity) => T)[] = []
): Promise<T | null> => {
  const entities = await getEntities<T>(entityType, converters);
  if (entities) {
    const entity = entities.find((e) => e.slug === slug && !e.draft);
    return entity || null;
  }
  return null;
}
