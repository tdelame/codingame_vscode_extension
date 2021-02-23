# Change Log

All notable changes to the CodinGame extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
