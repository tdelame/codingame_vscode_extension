import { ExtensionContext, commands } from 'vscode';

import { createNewProject } from './commands/createNewProject';
import { openBotProject } from './commands/openBotProject';
import { configureBuild } from './commands/configureBuild';
import { saveCurrentVersion } from './commands/saveCurrentVersion';

export function activate(_context: ExtensionContext) {
	commands.registerCommand("codingame.createNewProject", createNewProject);
	commands.registerCommand("codingame.openBotProject", openBotProject);
	commands.registerCommand("codingame.configureBuild", configureBuild);
	commands.registerCommand("codingame.saveCurrentVersion", saveCurrentVersion);
	console.log("CodinGame extension activated");
}

// This method is called when your extension is deactivated
export function deactivate() {}
