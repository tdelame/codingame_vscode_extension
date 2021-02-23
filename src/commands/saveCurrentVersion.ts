import * as fs from 'fs';
import * as vscode from 'vscode';
import { checkFileExistsSync } from '../utils';

export async function saveCurrentVersion() {
  // fetch project name and path
  if (vscode.workspace.workspaceFolders === undefined) {
    vscode.window.showErrorMessage("Cannot configure CodinGame project build as there is no opened folder");
    return;
  }
  const rootUri = vscode.workspace.workspaceFolders[0].uri;
  const projectName = vscode.workspace.workspaceFolders[0].name;

  // make sure current version exists as well as the CMakeLists.txt file
  const currentVersionUri = vscode.Uri.joinPath(rootUri, 'package', 'bot.cpp');
  if (!checkFileExistsSync(currentVersionUri.fsPath)) {
    vscode.window.showErrorMessage(`${projectName}: no current bot version. Please configure and build the project first.`);
    return;
  }
  const cmakeFileUri = vscode.Uri.joinPath(rootUri, 'PreviousBotVersions.cmake');

  // ask for a version name
  const inputOptions = <vscode.InputBoxOptions>{
    prompt: 'Bot Version Name',
    validateInput: (text: string): string | undefined => {
      if (checkFileExistsSync(vscode.Uri.joinPath(rootUri, 'package', text + '.cpp').fsPath)) {
        return 'A version with that name already exists';
      }
      return undefined;
    }
  };
  vscode.window.showInputBox(inputOptions)
    .then(name => {
      if (!name) {
        return;
      }

      const newVersionUri = vscode.Uri.joinPath(rootUri, 'package', name + '.cpp');
      const newText = `# Version ${name} created at ${Date()}\nadd_executable( ${name} "package/${name}.cpp" )\n`;
      vscode.workspace.fs.copy(currentVersionUri, newVersionUri);
      fs.appendFileSync(cmakeFileUri.fsPath, newText);
    });
}
