import * as vscode from 'vscode';
import { getGameId, getGamerEmail, getGamerPassword, getIsMulti } from '../config';
import { getVersionCode, getVersionNameArray } from '../utils';

const esmImport = require('esm')(module);
// eslint-disable-next-line @typescript-eslint/naming-convention
const { CookieJar, fetch } = esmImport('node-fetch-cookies');

interface RequiredInfo {
  projectFolderPath: string
  projectName: string
  gameId: string
  gamerEmail: string
  gamerPassword: string
}

async function fetchRequiredInfo() : Promise<RequiredInfo | undefined> {
  if (vscode.workspace.workspaceFolders === undefined) {
    return undefined;
  }

  const configGameId = getGameId();
  if (!configGameId) {
    return undefined;
  }

  const configGamerEmail = await getGamerEmail();
  if (!configGamerEmail) {
    return undefined;
  }

  const configGamerPassword = await getGamerPassword();
  if (!configGamerPassword) {
    return undefined;
  }

  return {
    projectFolderPath: vscode.workspace.workspaceFolders[0].uri.fsPath,
    projectName: vscode.workspace.workspaceFolders[0].name,
    gameId: configGameId,
    gamerEmail: configGamerEmail,
    gamerPassword: configGamerPassword
  };
}

export async function sendBotCode() {
  const info = await fetchRequiredInfo();
  if (!info) {
    return;
  }

  const versionPickOption = <vscode.QuickPickOptions>{
    prompt: `Which ${info.projectName} version to send?`,
    canPickMany: false
  };
  const versionName = await vscode.window.showQuickPick( getVersionNameArray(info.projectFolderPath), versionPickOption );
  if (!versionName) {
    return;
  }

  try {
    const cookieJar = new CookieJar();
    let response = await fetch(cookieJar, 'https://www.codingame.com/services/Codingamer/loginSiteV2', {
      method: 'POST',
      body: JSON.stringify([info.gamerEmail, info.gamerPassword, true])
    });

    if (!response.ok) {
      vscode.window.showErrorMessage(`Failed to login on CodinGame: ${response.statusText}`);
      return;
    }

    let content = await response.json();
    const gamerId = content['codinGamer']['userId'];
    response = await fetch(cookieJar, 'https://www.codingame.com/services/Puzzle/generateSessionFromPuzzlePrettyId', {
      method: 'POST',
      body: JSON.stringify([gamerId, info.gameId, false])
    });

    if (!response.ok) {
      vscode.window.showErrorMessage(`Failed to open session for game ${info.gameId} on CodinGame: ${response.statusText}`);
      return;
    }

    content = await response.json();
    const handle = content['handle'];
    const postBotBody = {
      code: getVersionCode(info.projectFolderPath, versionName),
      'programmingLanguageId': 'C++',
      ...(getIsMulti() ? {'multi': {'agentsIds': [-1, -2], 'gameOptions': null}} : null )
    };
    response = await fetch(cookieJar, 'https://www.codingame.com/services/TestSession/play', {
      method: 'POST',
      body: JSON.stringify([handle, postBotBody])
    });

    if (!response.ok) {
      vscode.window.showErrorMessage(`Failed to send bot version ${versionName} for game ${info.gameId}: ${response.statusText}`);
      return;
    }

    vscode.window.showInformationMessage(`Bot version ${versionName} for game ${info.gameId} sent`);
  }
  catch( error ) {
    vscode.window.showErrorMessage(`Failed to send bot code for game ${info.gameId} on CodinGame: ${error}`);
  }
}
