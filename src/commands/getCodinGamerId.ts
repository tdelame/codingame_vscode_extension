import * as fs from 'fs';
import * as vscode from 'vscode';
const esmImport = require('esm')(module);
// eslint-disable-next-line @typescript-eslint/naming-convention
const { CookieJar, fetch } = esmImport('node-fetch-cookies');
import { getGamerEmail, getGamerPassword } from '../config';

export async function getCodinGamerId() {
  const email = await getGamerEmail();
  if (!email) {
    return;
  }

  const password = await getGamerPassword();
  if (!password) {
    return;
  }

  const cookieJar = new CookieJar();
  try {
    const answer = await fetch(cookieJar, 'https://www.codingame.com/services/Codingamer/loginSiteV2', {
      method: 'POST',
      body: JSON.stringify([email, password, true])
    });
    const content = await answer.json();
    vscode.window.showInformationMessage(`Your CodinGamer Id is ${content['codinGamer']['userId']}`);
  }
  catch (error) {
    vscode.window.showErrorMessage(`Failed to fetch your CodinGamer Id: ${error}`);
  }
}
