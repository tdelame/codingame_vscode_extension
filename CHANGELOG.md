# Change Log

All notable changes to the CodinGame extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
