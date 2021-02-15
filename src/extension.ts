import * as vscode from 'vscode';

import { createNewProject } from './commands/createNewProject';
import { configureBuild } from './commands/configureBuild';
import { saveCurrentVersion } from './commands/saveCurrentVersion';
import { getCodinGamerId } from './commands/getCodinGamerId';
import { sendBotCode } from './commands/sendBotCode';

export async function activate(context: vscode.ExtensionContext) {
  vscode.commands.registerCommand("codingame.createNewProject", createNewProject);
  vscode.commands.registerCommand("codingame.configureBuild", configureBuild);
  vscode.commands.registerCommand("codingame.saveCurrentVersion", saveCurrentVersion);
  vscode.commands.registerCommand("codingame.getCodinGamerId", getCodinGamerId);
  vscode.commands.registerCommand("codingame.sendBotCode", sendBotCode);
  console.log("CodinGame extension activated");
}

// this method is called when your extension is deactivated
export function deactivate() { }
