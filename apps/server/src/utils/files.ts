import path from 'path';
import fs from 'fs';

export const readJSON = <T>(filePath: string, defaultValue: T) => {
  if (!fs.existsSync(filePath)) {
    return defaultValue;
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

export const writeJSON = <T>(filePath: string, data: T) => {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonData, 'utf-8');
};

export const copyFile = (src: string, dest: string) => {
  fs.copyFileSync(src, dest);
};

export const copyDirectory = (src: string, dest: string) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      continue; // Ignore hidden files
    }

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
};
