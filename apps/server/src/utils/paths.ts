import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();

export const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

const ensureAndReturnDir = (relativePath: string) => {
  const dir = path.resolve(projectRoot, relativePath);
  ensureDirectoryExists(dir);
  return dir;
}

export const getDataDir = () => process.env.APP_DATA_DIR ?? ensureAndReturnDir("./data");

export const getContentDir = () => process.env.APP_CONTENT_DIR ?? ensureAndReturnDir("./content");

export const getPublicDir = () => {
  if (process.env.APP_PUBLIC_DIR) return process.env.APP_PUBLIC_DIR;

  const candidates = [
    path.resolve(projectRoot, "./apps/web/dist"),
    path.resolve(projectRoot, "../web/dist"),
  ];

  const found = candidates.find((dir) => fs.existsSync(path.join(dir, "index.html")));
  return found ?? candidates[0];
};
