import * as fs from 'fs';
import * as path from 'path';

export function checkFileExists(filePath: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (stats && stats.isFile()) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

export function checkDirectoryExists(dirPath: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.stat(dirPath, (err, stats) => {
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
    return fs.statSync(filePath).isFile();
  } catch (e) {
  }
  return false;
}

export function checkDirectoryExistsSync(dirPath: string): boolean {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch (e) {
  }
  return false;
}

export function emailValidator(email: string) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function getVersionNameArray(projectFolderPath: string) {
  const packageFolderPath = path.join(projectFolderPath, 'package');
  const result: string[] = [];

  fs.readdirSync(packageFolderPath).forEach(filename => {
    const extension = path.extname(filename);
    if (extension === '.cpp') {
      result.push(filename === 'bot.cpp' ? '[current]' : filename.substring(0, filename.length - 4));
    }
  });

  return result;
}

export function getVersionCode(projectFolderPath: string, versionName: string) {
  const versionPath = path.join(projectFolderPath, 'package', (versionName === '[current]' ? 'bot' : versionName)+ '.cpp');
  return fs.readFileSync(versionPath, 'utf-8');
}
