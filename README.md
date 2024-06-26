# CodinGame extension for VSCode

This extension gathers some tools I use to develop more easily bots for CodinGame. The priorities of this extension are to satisfy my current needs while being simple. As a result, the extension is not very flexible or customizable.

You can read more about this extension and how to use it [in this article on my blog](https://virtual-atom.com/codingame/tooling/).

Keep in mind that this extension is the first I write. Also, I never programmed in TypeScript before. Thus, there might be silly things I do here that make you want to pull your hair.

> If you have any feature or improvement suggestions or want to participate in the development, let me know!
## 1. Features

### 1.1. Create a New C++ Bot Project

![Create New Bot Command](data/create_new_bot.gif)

Create a new C++ bot project from a starter folder. The starter folder is expected to respect these rules:
- have a `CMakeLists.txt` at its root to build the project. This CMakeLists.txt must honor the following variables
  - REPOSITORY_ROOT, path of the root CodinGame folder, containing all bots and tools,
  - INCLUDE_DIR, path to the main C++ include folder where you can place common headers and external library headers,
  - LIB_DIR, path to the main C++ libraries folder where you can place external libraries.
- the build places the source code of the different bot versions in a `package` folder. Remember that the CodinGame platform requires the bots to fit in a single file. The current bot version is in `package/bot.cpp`,
- the `CMakeLists.txt` must ensure the file `PreviousBotVersions.cmake` exists and include it.

I provide a working example of [starter C++ CodinGame project](https://github.com/tdelame/codingame_starter) in another repository.

### 1.2. Configure Project Build

![Configure Bot Command](data/configure_bot.gif)

Configure the build a bot, choosing its build type among Dev, Release, and Debug. Once the configuration is done, you can press `CTRL+SHIFT+B` to build the project, if you used [my starter C++ CodinGame project](https://github.com/tdelame/codingame_starter). You will also have symbol indexing, allowing you to navigate to symbols definitions or declarations, open headers, rename variables, find references, and so on.

### 1.3 Open Bot Project

Open a bot project store in a folder inside the root directory of your CodinGame projects. The command is case insensitive, so if you have a bot project named `MyBot`, you can simply request the project for `mybot`.
### 1.4. Save Current Bot Version

Save the current version of the bot, i.e. the file `package/bot.cpp`, in a new file in the `package` folder. The new file is added the `PreviousBotVersions.cmake` in order to be compiled.

## 2. Requirements

For this extension to behave as expected, you need to have the following tools installed:
- C/C++ VS Code extension,
- `cmake` to generate a build configuration for your projects,
- `ninja` to build your projects; this generator is fast and provides `compile_commands.json` which is used by IntelliSense,
- `compdb` to extend the `compile_commands.json` file with headers, in order to improve the indexing done by IntelliSense
- `clang` to perform the indexing done by IntelliSense.

The starter C++ project I provide also requires `python` to execute a script that merge multiple source files into one file. It also contains a `.editorconfig` that could be recognized by the EditorConfig for VS Code extension.

## 3. Extension Settings

This extension contributes the following settings:

* `codinGame.rootPath`: set it to the root directory of your CodinGame projects.
* `codinGame.includePath`: set it to the folder path containing common headers you use in your bots and tools. If not defined, it will be `codinGame.rootPath/tools/include`.
* `codinGame.libPath`: set it to the folder path containing common libraries you use in your tools. If not defined, it will be `codinGame.rootPath/tools/lib`.
* `codinGame.starterPath`: set it to the folder path containing an initial configuration for a bot. If not defined, it will be `codingGame.rootPath/tools/starter`
* `codinGame.cmakeExtra`: extra arguments that are passed to `CMake` when configuring the build
* `codinGame.cCompilerPath`: path to the C compiler to use to compile bots. If not defined, `CMake` will decide itself.
* `codinGame.cppCompilerPath`: path to the C++ compiler to use to compile bots. If not defined, `CMake` will decide itself.

## 4. Known Issues

## 5. Release Notes

## [2.0.1] - 2024-05-05

### Changed
- Updated extension to vscode 1.88 version

### Removed
- Send bot code and get CodinGame Id commands were removed, as the CodinGame API changes too often to rely on it
- Removed settings associated with such commands

### Fixed
- Detect when we are trying to create a bot with an already used bot name.

## [1.0.2] - 2021-03-06

### Added
- Global setting for `CPPCompilerPath`
- Global setting for `CCompilerPath`
- Global setting for `cmakeExtra`

### Fixed
- Wait for the new project folder to be fully copied before opening it
- Path manipulation on Windows
- Images in the extension README

## [1.0.1] - 2021-02-23

### Added
- Command to open bot project

### Changed
- save current bot command now uses `PreviousBotVersions.cmake` file

## [1.0.0] - 2021-02-16

### Added
- Command to create a bot project from a starter project
- Command to configure a bot build system
- Command to save current bot code as a named version
- Command to get CodinGamer Id from an account email + password
- Command to send a bot to CodinGame
- Global settings for `rootPath`, `includePath`, `libPath`, and `starterPath` that are used to create and configure a bot
- Global settings for `gamerPassword` and `gamerEmail` to connect to a CodinGame account
- Project settings for `gameId` and `isMulti` that are used to send a bot to CodinGame
