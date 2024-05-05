import { readdirSync } from 'fs';
import { InputBoxOptions, window, commands, Uri } from 'vscode';
import { join } from 'path';
import { getRootPath } from '../config';

export async function openBotProject() {

  // make sure the extension knows about the root path, containing every thing reused in bot projects
  const rootPath = await getRootPath();
  if (!rootPath) {
    return;
  }

  // ask for a project name
  const inputOptions = <InputBoxOptions>{
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

  window.showInputBox(inputOptions)
    .then(name => {
      if (!name) {
        return;
      }

      const lowercaseText = name.toLowerCase();

      for (let filename of readdirSync(rootPath)) {
        if (filename.toLowerCase() === lowercaseText) {
          const projectUri = Uri.file(join(rootPath, filename));
          commands.executeCommand('vscode.openFolder', projectUri, false);
          return;
        }
      }

      window.showErrorMessage(`Cannot find any ${join(rootPath, name)} folder`);
    });
}
