import { stat, statSync } from 'fs';

export function checkFileExists(filePath: string): Promise<boolean> {
  return new Promise((resolve, _reject) => {
    stat(filePath, (_err, stats) => {
      if (stats && stats.isFile()) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}
  
export function checkDirectoryExists(dirPath: string): Promise<boolean> {
  return new Promise((resolve, _reject) => {
    stat(dirPath, (_err, stats) => {
      if (stats && stats.isDirectory()) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}
  
export function checkFileExistsSync(filePath: string): boolean {
  try {
    return statSync(filePath).isFile();
  } catch (e) {
  }
  return false;
}

export function checkDirectoryExistsSync(dirPath: string): boolean {
  try {
    return statSync(dirPath).isDirectory();
  } catch (e) {
  }
  return false;
}