import { readdirSync } from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';
import { getRootPath } from '../config';

export async function openBotProject() {

  // make sure the extension knows about the root path, containing every thing reused in bot projects
  const rootPath = await getRootPath();
  if (!rootPath) {
    return;
  }

  // ask for a project name
  const inputOptions = <vscode.InputBoxOptions>{
    prompt: `CodinGame Bot Name`,
    validateInput: (text: string): string | undefined => {
      const lowercaseText = text.toLowerCase();
      for (let filename of readdirSync(rootPath)) {
        if (filename.toLowerCase() === lowercaseText) {
          return undefined;
        }
      }

      return `Unknown project ${text} in folder ${rootPath}`;
    }
  };

  vscode.window.showInputBox(inputOptions)
    .then(name => {
      if (!name) {
        return;
      }

      const rootPathUri = vscode.Uri.parse(rootPath);
      const lowercaseText = name.toLowerCase();

      for (let filename of readdirSync(rootPath)) {
        if (filename.toLowerCase() === lowercaseText) {
          const projectUri = vscode.Uri.joinPath(rootPathUri, filename);
          vscode.commands.executeCommand('vscode.openFolder', projectUri, false);
          return;
        }
      }

      vscode.window.showErrorMessage(`Cannot find any ${path.join(rootPath, name)} folder`);
    });
}
