---
title: CLI Reference
description: All VibeCheck CLI commands.
---

## Commands

### `vibecheck init`
Interactive setup wizard. Detects framework, configures presets and agents.

### `vibecheck add <id>`
Add a rule or preset: `vibecheck add security/branch-protection` or `vibecheck add preset:react-19`.

### `vibecheck remove <id>`
Remove a rule or preset: `vibecheck remove preset:tailwind`.

### `vibecheck generate`
Regenerate all hook scripts and agent configs from current config.

### `vibecheck doctor`
Validate config and hook health. Reports issues with config, missing hooks, broken rules.

### `vibecheck lint`
Static analysis mode. Scans project files and reports violations.

```bash
vibecheck lint                         # Text output
vibecheck lint --format json           # JSON output
vibecheck lint --format github-actions # GitHub annotations
```

Exits with code 1 if blocking violations found (CI-friendly).

### `vibecheck learn`
Scan codebase for conventions. Discovers import patterns, naming conventions, directory structure.

### `vibecheck report`
Generate quality dashboard from rule hit data. Outputs markdown to `.vibecheck/reports/`.

### `vibecheck eject`
Export standalone hooks that work without VibeCheck installed. Removes dependency requirement.

### `vibecheck upgrade`
Check for and apply updates to VibeCheck and installed plugins.

```bash
vibecheck upgrade --check  # Check only
vibecheck upgrade          # Apply updates
```
