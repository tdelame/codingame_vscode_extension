import * as vscode from 'vscode';
import * as path from 'path';
import { emailValidator, checkDirectoryExistsSync } from './utils';

export function getConfig() {
  return vscode.workspace.getConfiguration('codinGame');
}

export function getGameId() {
  return getConfig().get<string>('gameId');
}

export function getIsMulti() {
  return getConfig().get<boolean>('isMulti');
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

export async function getGamerPassword() {
  let gamerPassword = getConfig().get<string>('gamerPassword');
  if (!gamerPassword) {
    const passwordInputOption = <vscode.InputBoxOptions>{
      prompt: 'Enter your CodinGame Password',
      password: true,
      ignoreFocusOut: true
    };

    const inputPassword = await vscode.window.showInputBox(passwordInputOption);
    if( !inputPassword) {
      return undefined;
    }

    await getConfig().update('gamerPassword', inputPassword, vscode.ConfigurationTarget.Global);
    gamerPassword = inputPassword;
  }
  return gamerPassword;
}

export async function getGamerEmail() {
  let gamerEmail = getConfig().get<string>('gamerEmail');
  if (!gamerEmail) {
    const emailInputOption = <vscode.InputBoxOptions>{
      prompt: 'Enter your CodinGame Email',
      validateInput: (text: string): string | undefined => {
        if (!emailValidator(text)) {
          return 'Invalid Email';
        }
        return undefined;
      }
    };

    const inputEmail = await vscode.window.showInputBox(emailInputOption);
    if( !inputEmail) {
      return undefined;
    }

    await getConfig().update('gamerEmail', inputEmail, vscode.ConfigurationTarget.Global);
    gamerEmail = inputEmail;
  }
  return gamerEmail;
}

export async function getRootPath() {
  let rootPath = getConfig().get<string>('rootPath');

  if (!rootPath) {
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
    includePath = path.join(rootPath, 'tools', 'include');
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
    libPath = path.join(rootPath, 'tools', 'lib');
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
    starterPath = path.join(rootPath, 'tools', 'starter');
  }
  return starterPath;
}
