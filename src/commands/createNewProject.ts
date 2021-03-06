import * as vscode from 'vscode';
import * as path from 'path';
import { getRootPath, getStarterPath } from '../config';
import { checkDirectoryExistsSync, checkFileExistsSync } from '../utils';

export async function createNewProject() {

  // make sure the extension knows about the root path, containing every thing reused in bot projects
  const rootPath = await getRootPath();
  if (!rootPath) {
    return;
  }

  // make sure we know the path to the starter folder
  const starterPath = await getStarterPath();
  if (!starterPath || !checkDirectoryExistsSync(starterPath)) {
    vscode.window.showErrorMessage(`Invalid C++ CodinGame starter bot path`);
    return;
  }

  // ask for a project name
  const inputOptions = <vscode.InputBoxOptions>{
    prompt: `CodinGame Bot Name`,
    validateInput: (text: string): string | undefined => {
      const projectPath = path.join(rootPath, text);
      if (checkFileExistsSync(projectPath)) {
        return `${text} project already exists in ${rootPath}`;
      }
      return undefined;
    }
  };

  vscode.window.showInputBox(inputOptions)
    .then(name => {
      if (!name) {
        return;
      }

      const projectPathUri = vscode.Uri.joinPath(vscode.Uri.file(rootPath), name);
      vscode.workspace.fs.copy(vscode.Uri.file(starterPath), projectPathUri);
      vscode.commands.executeCommand('vscode.openFolder', projectPathUri, false);
    });
}
