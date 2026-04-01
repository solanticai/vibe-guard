---
title: Getting Started
description: Install VibeCheck and set up AI coding guardrails in 30 seconds.
---

## Installation

```bash
npm install -D @solanticai/vibecheck
```

## Quick Start

```bash
npx vibecheck init
```

The init wizard will:
1. Detect your framework (Next.js, React, etc.)
2. Ask which AI agents you use
3. Ask which presets to enable
4. Configure protected branches

## What Gets Generated

After running `init`, VibeCheck creates:

- `vibecheck.config.ts` — your configuration file
- `.claude/settings.json` — Claude Code hook entries (merged with existing)
- `.vibecheck/hooks/` — hook scripts that enforce your rules
- `.vibecheck/cache/` — pre-compiled config for fast hook execution

## Verify Setup

```bash
npx vibecheck doctor
```

## How It Works

```
Developer prompt → AI Agent → VibeCheck hooks → PASS or BLOCK
```

For Claude Code, hooks execute as subprocesses before each tool use. They read the proposed change, evaluate it against your rules, and either allow (exit 0) or block (exit 2).

**Only Claude Code provides runtime enforcement.** Cursor, Codex, and OpenCode receive advisory guidance via generated config files.
