import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { getContentDir } from "../utils/paths";
import { parseMarkdown } from "../utils/md";
import { slugify } from "../../../shared";
import { getFromCache, setInCache } from "./mdCacheService";
import { ENTITY_TYPE, MdEntity } from "../../../shared/types";

enum DIR_MAP {
  POST = "posts",
  PAGE = "pages",
  TAG = "tags",
  NOTIFICATION = "notifications",
  WIDGET = "widgets",
  SIDEBAR = "sidebars",
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function normalizeAssetPath<T>(value: T): T {
  if (value instanceof Date) return value;

  if (typeof value === "string") {
    return value.replace(/^(\/|\.\/|\.\.\/)?assets\//, "/content-assets/") as unknown as T;
  }

  if (Array.isArray(value)) {
    return value.map((v) => normalizeAssetPath(v)) as unknown as T;
  }

  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = normalizeAssetPath(v);
    }
    return out as unknown as T;
  }

  // Everything else (Map, Set, RegExp, Buffer, class instances, etc.) stays untouched
  return value;
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
  const parsed = matter(fileContent);
  parsed.data = normalizeAssetPath(parsed.data);

  return {
    ...parsed.data,
    slug: slugify(file.replace(`${entityType}.`, "").replace(".md", "")),
    content: parseMarkdown(parsed.content.trim()),
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
