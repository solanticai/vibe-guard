---
title: Plugin Authoring
description: Create and publish a VibeCheck plugin.
---

## Plugin Structure

```typescript
import type { VibeCheckPlugin } from '@solanticai/vibecheck';

const plugin: VibeCheckPlugin = {
  name: 'vibecheck-plugin-my-rules',
  version: '1.0.0',
  rules: [/* your rules */],
  presets: [/* your presets */],
};

export default plugin;
```

## Naming
- Package: `vibecheck-plugin-<name>`
- Rule IDs: `<name>/<rule>` (e.g., `my-rules/no-barrel-imports`)

## Validation

```typescript
import { validatePlugin } from '@solanticai/vibecheck';

const result = validatePlugin(myPlugin, 'vibecheck-plugin-my-rules');
// result.valid, result.errors, result.warnings
```

## Publishing
1. Build with TypeScript
2. Test with `vibecheck doctor`
3. `npm publish`
4. Users add to config: `plugins: ['vibecheck-plugin-my-rules']`
