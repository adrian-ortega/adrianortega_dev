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

export const getDataDir = () => {
  if(process.env.APP_DATA_DIR) {
    ensureDirectoryExists(process.env.APP_DATA_DIR);
    return process.env.APP_DATA_DIR;
  }
  
  const candidates = [
    path.resolve(projectRoot, "./apps/server/data"),
    path.resolve(projectRoot, "../server/data"),
  ];
  
  const found = candidates.find((dir) => fs.existsSync(dir));
  return found ?? ensureAndReturnDir("./apps/server/data");
};

export const getContentDir = () => {
  if (process.env.APP_CONTENT_DIR) {
    ensureDirectoryExists(process.env.APP_CONTENT_DIR);
    return process.env.APP_CONTENT_DIR;
  }

  const candidates = [
    path.resolve(projectRoot, "./apps/server/content"),
    path.resolve(projectRoot, "../server/content"),
  ];

  const found = candidates.find((dir) => fs.existsSync(dir));
  return found ?? ensureAndReturnDir("./apps/server/content");
}

export const getPublicDir = () => {
  if (process.env.APP_PUBLIC_DIR) return process.env.APP_PUBLIC_DIR;

  const candidates = [
    path.resolve(projectRoot, "./apps/web/dist"),
    path.resolve(projectRoot, "../web/dist"),
  ];

  const found = candidates.find((dir) => fs.existsSync(path.join(dir, "index.html")));
  return found ?? candidates[0];
};
