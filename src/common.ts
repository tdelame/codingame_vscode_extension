import * as vscode from 'vscode';
import * as fs from 'fs';

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

export function getConfig() {
  return vscode.workspace.getConfiguration('codinGame');
}

export async function getRootPath() {
  let rootPath = getConfig().get<string>('rootPath');

  if ( !rootPath ) {
    vscode.window.showInformationMessage(`CodinGame root path not set. Configure the extension or set codinGame.rootPath setting in the input box`);

    const inputOptions = <vscode.InputBoxOptions>{
      prompt: `CodinGame root path`
    };
    await vscode.window.showInputBox(inputOptions).then(async inputRootPath => {
      if (!inputRootPath) {
        return;
      }

      if (!checkDirectoryExistsSync(inputRootPath)) {
        vscode.window.showErrorMessage(`${inputRootPath} is not an existing folder path`);
        return;
      }

      await getConfig().update('rootPath', inputRootPath, vscode.ConfigurationTarget.Global);
      rootPath = inputRootPath;
    });
  }
  return rootPath;
}

export async function getIncludePath() {
  let includePath = getConfig().get<string>('includePath');
  if (!includePath) {
    let rootPath = await getRootPath();
    if (!rootPath) {
      return undefined;
    }
    includePath = vscode.Uri.joinPath(vscode.Uri.parse(rootPath), 'tools', 'include').fsPath;
  }
  return includePath;
}

export async function getLibPath() {
  let libPath = getConfig().get<string>('libPath');
  if (!libPath) {
    let rootPath = await getRootPath();
    if (!rootPath) {
      return undefined;
    }
    libPath = vscode.Uri.joinPath(vscode.Uri.parse(rootPath), 'tools', 'lib').fsPath;
  }
  return libPath;
}

export async function getStarterPath() {
  let starterPath = getConfig().get<string>('starterPath');
  if (!starterPath) {
    let rootPath = await getRootPath();
    if (!rootPath) {
      return undefined;
    }
    starterPath = vscode.Uri.joinPath(vscode.Uri.parse(rootPath), 'tools', 'starter').fsPath;
  }
  return starterPath;
}
