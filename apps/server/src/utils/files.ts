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
