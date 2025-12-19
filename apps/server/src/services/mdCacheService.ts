import fs from "node:fs/promises"
import path from "node:path";
import { ensureDirectoryExists, getDataDir } from "../utils/paths";
import { readJSON, writeJSON } from "../utils/files";

const dataDir = getDataDir();

// const isEnabled = () => getSetting('cached', true);
const isEnabled = async () => true;

const getCacheFilePath = (entityType: string): string =>
  path.resolve(dataDir, `entity.${entityType}.json`);

export const getFromCache = async <T extends any>(entityType: string): Promise<T[] | null> => {
  if (!await isEnabled()) return null;
  try {
    return readJSON<T[]>(getCacheFilePath(entityType), null as any);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

export const setInCache = async <T extends any>(entityType: string, value: T): Promise<void> => {
  ensureDirectoryExists(dataDir);
  writeJSON(getCacheFilePath(entityType), value);
}

export const flushEntityCacheByType = (entityType: string) => {
  const filePath = getCacheFilePath(entityType);
  fs.unlink(filePath).catch((error) => {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  });
};
