---
title: Configuration
description: Configure VibeCheck rules, presets, and adapters.
---

## Config File

```typescript
import { defineConfig } from '@solanticai/vibecheck';

export default defineConfig({
  presets: ['nextjs-15', 'tailwind', 'supabase'],
  agents: ['claude-code', 'cursor'],
  rules: {
    'security/branch-protection': {
      protectedBranches: ['main', 'master', 'staging'],
    },
    'quality/naming-conventions': false, // Disable a rule
    'quality/anti-patterns': { severity: 'warn' },
  },
  plugins: ['vibecheck-plugin-example'],
});
```

## Resolution Order

1. **Rule defaults** (lowest priority)
2. **Presets** (applied in declaration order — last preset wins)
3. **User config** (highest priority — always wins)

## Supported Formats

| Format | File | Priority |
|--------|------|----------|
| TypeScript | `vibecheck.config.ts` | 1 (highest) |
| JavaScript | `vibecheck.config.js` | 2 |
| JSON | `.vibecheckrc.json` | 3 |
| package.json | `"vibecheck"` field | 4 (lowest) |

## Options

### `presets`
Array of preset IDs. See [Presets](/VibeCheck/presets/nextjs-15/).

### `agents`
Array of AI agents: `claude-code` (runtime), `cursor`, `codex`, `opencode` (advisory).

### `rules`
Per-rule config. `false` disables, `true` enables with defaults, object for custom options.

### `plugins`
Array of npm package names exporting `VibeCheckPlugin`.
