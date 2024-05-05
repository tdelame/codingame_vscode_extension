import { appendFileSync } from 'fs';
import { workspace, window, Uri, InputBoxOptions } from 'vscode';
import { checkFileExistsSync } from '../utils';

export async function saveCurrentVersion() {
  // fetch project name and path
  if (workspace.workspaceFolders === undefined) {
    window.showErrorMessage("Cannot configure CodinGame project build as there is no opened folder");
    return;
  }
  const rootUri = workspace.workspaceFolders[0].uri;
  const projectName = workspace.workspaceFolders[0].name;

  // make sure current version exists as well as the CMakeLists.txt file
  const currentVersionUri = Uri.joinPath(rootUri, 'package', 'bot.cpp');
  if (!checkFileExistsSync(currentVersionUri.fsPath)) {
    window.showErrorMessage(`${projectName}: no current bot version. Please configure and build the project first.`);
    return;
  }
  const cmakeFileUri = Uri.joinPath(rootUri, 'PreviousBotVersions.cmake');

  // ask for a version name
  const inputOptions = <InputBoxOptions>{
    prompt: 'Bot Version Name',
    validateInput: (text: string): string | undefined => {
      if (checkFileExistsSync(Uri.joinPath(rootUri, 'package', text + '.cpp').fsPath)) {
        return 'A version with that name already exists';
      }
      return undefined;
    }
  };
  window.showInputBox(inputOptions)
    .then(name => {
      if (!name) {
        return;
      }

      const newVersionUri = Uri.joinPath(rootUri, 'package', name + '.cpp');
      const newText = `# Version ${name} created at ${Date()}\nadd_executable( ${name} "package/${name}.cpp" )\n`;
      workspace.fs.copy(currentVersionUri, newVersionUri);
      appendFileSync(cmakeFileUri.fsPath, newText);
    });
}
