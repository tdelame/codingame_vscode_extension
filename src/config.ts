import { window, workspace, InputBoxOptions, ConfigurationTarget } from 'vscode';
import { join } from 'path';
import { checkDirectoryExistsSync } from './utils';

export function getConfig() {
  return workspace.getConfiguration('codinGame');
}

export function getCmakeExtraArguments() {
  const fromConfig = getConfig().get<string>('cmakeExtra');
  return fromConfig ? fromConfig : "";
}

export function getCppCompilerPath() {
  return getConfig().get<string>('cppCompilerPath');
}

export function getCCompilerPath() {
  return getConfig().get<string>('cCompilerPath');
}

export async function getRootPath() {
  let rootPath = getConfig().get<string>('rootPath');

  if (!rootPath) {
    window.showInformationMessage(`CodinGame root path not set. Configure the extension or set codinGame.rootPath setting in the input box`);

    const inputOptions = <InputBoxOptions>{
      prompt: `CodinGame root path`
    };
    await window.showInputBox(inputOptions).then(async inputRootPath => {
      if (!inputRootPath) {
        return;
      }

      if (!checkDirectoryExistsSync(inputRootPath)) {
        window.showErrorMessage(`${inputRootPath} is not an existing folder path`);
        return;
      }

      await getConfig().update('rootPath', inputRootPath, ConfigurationTarget.Global);
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
    includePath = join(rootPath, 'tools', 'include');
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
    libPath = join(rootPath, 'tools', 'lib');
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
    starterPath = join(rootPath, 'tools', 'starter');
  }
  return starterPath;
}
