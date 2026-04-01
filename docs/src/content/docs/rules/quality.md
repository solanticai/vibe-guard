---
title: Quality Rules
description: Rules that enforce code quality patterns and catch AI mistakes.
---

## quality/import-aliases
**Severity:** block | Enforces `@/` imports, blocks deep relative imports (4+ levels) and `src/` imports.

## quality/no-use-client-in-pages
**Severity:** block | Blocks `"use client"` directive in Next.js `page.tsx` and `layout.tsx` files.

## quality/naming-conventions
**Severity:** block | PascalCase for component files, `use` prefix for hooks, no vague filenames (`utils.ts`, `helpers.ts`).

```typescript
rules: {
  'quality/naming-conventions': {
    componentDirs: ['/components/', '/_components/'],
    hookDirs: ['/hooks/'],
    allowedVagueFiles: ['src/lib/utils.ts'],
  },
}
```

## quality/no-deprecated-api
**Severity:** block | Detects deprecated APIs: `cacheTime` (→ `gcTime`), `getServerSideProps` (→ Server Components), `React.FC`.

## quality/anti-patterns
**Severity:** warn | Catches AI mistakes. Enable features via preset or config:

```typescript
rules: {
  'quality/anti-patterns': {
    blockCssFiles: true,      // No CSS/SCSS in Tailwind projects
    blockInlineStyles: true,  // No style={{}} in JSX
    blockConsoleLog: true,    // No console.log in production
  },
}
```

## quality/file-structure
**Severity:** warn | Warns when components are outside `/components/` or hooks outside `/hooks/`.

## quality/hallucination-guard
**Severity:** warn | Verifies relative imports reference files that actually exist on disk.

## quality/test-coverage
**Severity:** warn | Warns when creating source files with no corresponding `.test` or `.spec` file.
