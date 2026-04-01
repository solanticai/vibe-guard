---
title: Claude Code
description: Runtime enforcement via Claude Code hooks.
---

**Enforcement: Runtime (blocks operations)**

Claude Code is the only adapter that provides true runtime enforcement. VibeCheck generates hook scripts that execute before each tool use and can block operations with exit code 2.

## Generated Files
- `.claude/settings.json` — hook entries (merged with existing)
- `.vibecheck/hooks/vibecheck-pretooluse.js` — PreToolUse hook
- `.vibecheck/hooks/vibecheck-posttooluse.js` — PostToolUse hook
- `.vibecheck/hooks/vibecheck-stop.js` — Stop hook
