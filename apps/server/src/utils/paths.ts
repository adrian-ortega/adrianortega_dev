import fs from "node:fs";
import path from "node:path";

export const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

const ensureAndReturnDir = (relativePath: string) => {
  const dir = path.resolve(process.cwd(), relativePath);
  ensureDirectoryExists(dir);
  return dir;
}

export const getPublicDir = () => process.env.APP_PUBLIC_DIR ?? ensureAndReturnDir("./public");

export const getDataDir = () => process.env.APP_DATA_DIR ?? ensureAndReturnDir("./data");

export const getContentDir = () => process.env.APP_CONTENT_DIR ?? ensureAndReturnDir("./content");
