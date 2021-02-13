import * as vscode from 'vscode';
import * as child_process from 'child_process';
import * as fs from 'fs';
import { checkFileExistsSync, checkDirectoryExistsSync, getRootPath, getIncludePath, getLibPath, getStarterPath } from './common';

async function createNewProject() {

  // make sure the extension knows about the root path, containing every thing reused in bot projects
  const rootPath = await getRootPath();
  if (!rootPath) {
    return;
  }

  const starterPath = await getStarterPath();
  if (!starterPath || !checkDirectoryExistsSync(starterPath)) {
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
      if (!name) {
        return;
      }

      const newProjectPath = vscode.Uri.joinPath(vscode.Uri.parse(rootPath), name);
      if (checkDirectoryExistsSync(newProjectPath.fsPath)) {
        vscode.window.showInformationMessage(`${name} project already exists in ${rootPath}`);
        loop = true;
        return;
      }

      await vscode.workspace.fs.copy(vscode.Uri.parse(starterPath), newProjectPath);
      vscode.commands.executeCommand('vscode.openFolder', newProjectPath, false);
    });
  }
}

async function configureBuild() {

  // fetch project name and path
  if (vscode.workspace.workspaceFolders === undefined) {
    vscode.window.showErrorMessage("Cannot configure CodinGame project build as there is no opened folder");
    return;
  }
  const rootUri = vscode.workspace.workspaceFolders[0].uri;
  const projectName = vscode.workspace.workspaceFolders[0].name;

  // make sure the current project folder contains a CMakeLists.txt that will be used to configure the build
  const cmakeListsUri = vscode.Uri.joinPath(rootUri, "CMakeLists.txt");
  if (!checkFileExistsSync(cmakeListsUri.fsPath)) {
    vscode.window.showInformationMessage(`CodinGame project ${projectName} has no CMakeLists.txt file in its root directory`);
    return;
  }

  // make sure the extension knows about the root path, containing every thing reused in bot projects
  const rootPath = await getRootPath();
  if (rootPath === undefined) {
    return;
  }

  // ensure the build directory exists
  const buildUri = vscode.Uri.joinPath(rootUri, "build");
  vscode.workspace.fs.createDirectory(buildUri);

  // create a pick window to chose build type
  const pickOptions = <vscode.QuickPickOptions>{
    placeHolder: `Choose build type for ${projectName}`,
    canPickMany: false,
  };
  vscode.window.showQuickPick(["Dev", "Release", "Debug"], pickOptions).then(async buildType => {

    // abord the configuration when the used escaped the pick window
    if (typeof buildType === "undefined") {
      return;
    }

    let execOptions = <child_process.ExecOptions>{ cwd: buildUri.fsPath };
    let commandString = `cd ${buildUri.fsPath} && cmake ../ -GNinja -DCMAKE_BUILD_TYPE=${buildType} ` +
      `-DPROJECT_ROOT=${rootPath} -DINCLUDE_DIR=${await getIncludePath()} -DLIB_DIR=${await getLibPath()} && ` +
      `compdb -p ${buildUri.fsPath} list > ${vscode.Uri.joinPath(rootUri, '.vscode', 'compile_commands.json').fsPath}`;
    child_process.exec(commandString, execOptions, (error, stdout, stderr) => {
      if (error) {
        vscode.window.showErrorMessage(`Failed to configure ${buildType} build for ${projectName}: ${stderr}`);
        return;
      }

      vscode.window.showInformationMessage(`${projectName}: ${buildType} build successfully configured`);
    });
  });
}

async function saveCurrentVersion() {
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
  const cmakeFileUri = vscode.Uri.joinPath(rootUri, 'CMakeLists.txt');
  if (!checkFileExistsSync(cmakeFileUri.fsPath)) {
    vscode.window.showErrorMessage(`${projectName}: no CMakeLists.txt found. Are you sure you are in a CodinGame bot project?`);
    return;
  }

  // ask for a version name
  vscode.window.showInputBox({
    prompt: 'Bot Version Name',
    validateInput: (text: string): string | undefined => {
      if (checkFileExistsSync(vscode.Uri.joinPath(rootUri, 'package', text + '.cpp').fsPath)) {
        return 'A version with that name already exists';
      }
      return undefined;
    }
    // then save the current version with this name
  }).then(name => {
    if (!name) {
      return;
    }

    const newVersionUri = vscode.Uri.joinPath(rootUri, 'package', name + '.cpp');
    const newText = `# Version ${name} created at ${Date()}\nadd_executable( ${name} "${newVersionUri.fsPath}" )\n`;
    vscode.workspace.fs.copy(currentVersionUri, newVersionUri);
    fs.appendFileSync(cmakeFileUri.fsPath, newText);
  });
}

export async function activate(context: vscode.ExtensionContext) {
  vscode.commands.registerCommand("codingame.createNewProject", createNewProject);
  vscode.commands.registerCommand("codingame.configureBuild", configureBuild);
  vscode.commands.registerCommand("codingame.saveCurrentVersion", saveCurrentVersion);
  console.log("CodinGame extension activated");
}

// this method is called when your extension is deactivated
export function deactivate() { }
