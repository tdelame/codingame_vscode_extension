import { workspace, window, QuickPickOptions, Uri } from 'vscode';
import { exec, ExecOptions } from 'child_process';
import { checkFileExistsSync } from '../utils';
import { getRootPath, getIncludePath, getLibPath, getCmakeExtraArguments, getCCompilerPath, getCppCompilerPath } from '../config';

export async function configureBuild() {

  // fetch project name and path
  if (workspace.workspaceFolders === undefined) {
    window.showErrorMessage("Cannot configure CodinGame project build as there is no opened folder");
    return;
  }
  const rootUri = workspace.workspaceFolders[0].uri;
  const projectName = workspace.workspaceFolders[0].name;

  // make sure the current project folder contains a CMakeLists.txt that will be used to configure the build
  const cmakeListsUri = Uri.joinPath(rootUri, "CMakeLists.txt");
  if (!checkFileExistsSync(cmakeListsUri.fsPath)) {
    window.showInformationMessage(`CodinGame project ${projectName} has no CMakeLists.txt file in its root directory`);
    return;
  }

  // make sure the extension knows about the root path, containing every thing reused in bot projects
  const rootPath = await getRootPath();
  if (rootPath === undefined) {
    return;
  }

  // ensure the build directory exists
  const buildUri = Uri.joinPath(rootUri, "build");
  workspace.fs.createDirectory(buildUri);

  // create a pick window to chose build type
  const pickOptions = <QuickPickOptions>{
    placeHolder: `Choose build type for ${projectName}`,
    canPickMany: false,
  };
  window.showQuickPick(["Dev", "Release", "Debug"], pickOptions).then(async buildType => {

    // abord the configuration when the used escaped the pick window
    if (typeof buildType === "undefined") {
      return;
    }

    const execOptions = <ExecOptions>{ cwd: buildUri.fsPath };

    let extraArguments = "";
    if( getCCompilerPath() ) {
      extraArguments += `-DCMAKE_C_COMPILER:PATH="${getCCompilerPath()}" `;
    }
    if( getCppCompilerPath() ) {
      extraArguments += `-DCMAKE_CXX_COMPILER:PATH="${getCppCompilerPath()}" `;
    }
    extraArguments += getCmakeExtraArguments();

    const commandString = `cd ${buildUri.fsPath} && ` +
      `cmake ../ -GNinja -DCMAKE_BUILD_TYPE=${buildType} ${extraArguments} ` +
      `-DPROJECT_ROOT=${rootPath} -DINCLUDE_DIR=${await getIncludePath()} -DLIB_DIR=${await getLibPath()} && ` +
      `compdb -p ${buildUri.fsPath} list > ${Uri.joinPath(rootUri, '.vscode', 'compile_commands.json').fsPath}`;
    exec(commandString, execOptions, (error, stdout, stderr) => {
      if (error) {
        window.showErrorMessage(`Failed to configure ${buildType} build for ${projectName}: ${stderr}`);
        return;
      }

      window.showInformationMessage(`${projectName}: ${buildType} build successfully configured`);
    });
  });
}
