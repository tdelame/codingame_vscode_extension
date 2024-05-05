import { window, InputBoxOptions, Uri, commands, workspace, InputBoxValidationMessage, InputBoxValidationSeverity } from 'vscode';
import { join } from 'path';
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
    window.showErrorMessage(`Invalid C++ CodinGame starter bot path`);
    return;
  }

  // ask for a project name
  const inputOptions = <InputBoxOptions>{
    prompt: `CodinGame Bot Name`,
    validateInput: (text: string): string | undefined | InputBoxValidationMessage => {
      const projectPath = join(rootPath, text);
      if (text.length < 1) {
        return <InputBoxValidationMessage>{
            "message": "Enter a non-existing bot name",
            "severity": InputBoxValidationSeverity.Info
        };
      }
      if (checkDirectoryExistsSync(projectPath)) {
        return `${text} project already exists in ${rootPath}`;
      }
      return undefined;
    }
  };

  window.showInputBox(inputOptions)
    .then(async name => {
      if (!name) {
        return;
      }

      const projectPath = join(rootPath, name);
      const projectPathUri = Uri.file(projectPath);
      const projectPathGitUri = Uri.file(join(projectPath, ".git"));
      await workspace.fs.copy(Uri.file(starterPath), projectPathUri);
      await workspace.fs.delete(projectPathGitUri, {"recursive":false, "useTrash":false});
      commands.executeCommand('vscode.openFolder', projectPathUri, false);
    });
}
