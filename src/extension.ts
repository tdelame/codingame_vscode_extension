import * as vscode from 'vscode';
import { getRootPath, getStarterPath, checkDirectoryExistsSync } from './common';

async function createNewProject() {

  // make sure the extension knows about the root path, containing every thing reused in bot projects
  const rootPath = await getRootPath();
  if (!rootPath) {
    return;
  }

  const starterPath = await getStarterPath();
  if( !starterPath || !checkDirectoryExistsSync(starterPath) ) {
    vscode.window.showErrorMessage(`Invalid C++ CodinGame starter bot path`);
    return;
  }

  // ask for a project name
  const inputOptions = <vscode.InputBoxOptions>{
    prompt: `CodinGame Bot Name`
  };

  let loop = true;
  while (loop) {
    loop = false;
    await vscode.window.showInputBox(inputOptions).then(async name => {
      if( !name ) {
        return;
      }

      const newProjectPath = vscode.Uri.joinPath(vscode.Uri.parse(rootPath), name);
      if( checkDirectoryExistsSync( newProjectPath.fsPath ) ) {
        vscode.window.showInformationMessage(`${name} project already exists in ${rootPath}`);
        loop = true;
        return;
      }

      await vscode.workspace.fs.copy( vscode.Uri.parse(starterPath), newProjectPath);
      vscode.commands.executeCommand('vscode.openFolder', newProjectPath, false);
    });
  }
}

export async function activate(context: vscode.ExtensionContext) {
  vscode.commands.registerCommand("codingame.createNewProject", createNewProject);
  console.log("CodinGame extension activated");
}

// this method is called when your extension is deactivated
export function deactivate() { }
