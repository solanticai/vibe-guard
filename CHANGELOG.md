# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-04-01

### Added

- Core rule engine with async-capable `check()` and `createEditVariant()` factory
- Config system with TypeScript support (via jiti), preset merging, pre-compilation
- 13 built-in rules: 5 security, 8 quality, 4 workflow
- 8 presets: nextjs-15, typescript-strict, react-19, supabase, tailwind, django, fastapi, laravel
- 5 adapters: Claude Code (runtime), Cursor (advisory), Codex (advisory), OpenCode (advisory), GitHub Actions
- 10 CLI commands: init, add, remove, generate, doctor, lint, learn, report, eject, upgrade
- Convention learning engine with import, naming, and structure analyzers
- Quality dashboard with rule hit tracking and markdown reports
- Plugin API for third-party rules and presets
- Eject command for standalone hook export
- Semver-aware version comparison for upgrade checker
- Eject module entry point for proper public API
- `.claude/CLAUDE.md` for dogfooding VibeCheck on itself

### Fixed

- Upgrade checker now uses semver comparison instead of string equality
- Eject module missing `index.ts` entry point

### Changed

- Test coverage thresholds raised to 70% (lines, functions, statements) and 65% (branches)
