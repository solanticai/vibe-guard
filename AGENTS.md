# VibeCheck — AI Agent Setup Instructions

Copy the relevant section below and provide it to your AI coding assistant (Claude Code, Codex, Cursor, etc.) as instructions for setting up VibeCheck in your project.

---

## For Claude Code

```
I want you to set up VibeCheck, an AI coding guardrails framework, in this project.

1. Install the package:
   npm install -D @solanticai/vibecheck

2. Run the interactive setup:
   npx vibecheck init

   When prompted:
   - Select presets that match the project's tech stack (e.g., nextjs-15, typescript-strict, react-19, tailwind, supabase)
   - Select "Claude Code" as the AI agent
   - Set protected branches to "main, master"

3. Verify the setup:
   npx vibecheck doctor

   All checks should pass. If any fail, fix the issues it reports.

4. (Optional) Connect to VibeCheck Cloud for analytics:
   npx vibecheck cloud login
   npx vibecheck cloud connect
   npx vibecheck generate

5. Run a lint scan to see current issues:
   npx vibecheck lint

After setup, VibeCheck will automatically enforce rules via hooks in .claude/settings.json.
The hooks fire on PreToolUse (before Edit/Write/Bash), PostToolUse (after), and Stop (session end).
If a rule blocks, the tool execution is prevented. Warnings are logged but don't block.

Key commands:
- npx vibecheck lint          — scan for issues
- npx vibecheck learn         — discover codebase conventions
- npx vibecheck report        — generate quality dashboard
- npx vibecheck doctor        — check config health
- npx vibecheck generate      — regenerate hooks after config changes
```

---

## For Codex CLI

```
I want you to set up VibeCheck, an AI coding guardrails framework, in this project.

1. Install: npm install -D @solanticai/vibecheck
2. Initialize: npx vibecheck init
   - Pick presets matching the project stack
   - Select "Codex" as the AI agent
   - Set protected branches to "main, master"
3. Verify: npx vibecheck doctor
4. Scan: npx vibecheck lint

VibeCheck generates an AGENTS.md file that Codex reads for advisory rules.
The rules are not runtime-enforced for Codex (advisory mode only).

After setup, run `npx vibecheck generate` whenever you change vibecheck.config.ts.
```

---

## For Cursor

```
I want you to set up VibeCheck, an AI coding guardrails framework, in this project.

1. Install: npm install -D @solanticai/vibecheck
2. Initialize: npx vibecheck init
   - Pick presets matching the project stack
   - Select "Cursor" as the AI agent
   - Set protected branches to "main, master"
3. Verify: npx vibecheck doctor
4. Scan: npx vibecheck lint

VibeCheck generates a .cursorrules file that Cursor reads for advisory rules.
The rules guide Cursor's suggestions but are not runtime-enforced.

After setup, run `npx vibecheck generate` whenever you change vibecheck.config.ts.
```

---

## For OpenCode

```
I want you to set up VibeCheck, an AI coding guardrails framework, in this project.

1. Install: npm install -D @solanticai/vibecheck
2. Initialize: npx vibecheck init
   - Pick presets matching the project stack
   - Select "OpenCode" as the AI agent
   - Set protected branches to "main, master"
3. Verify: npx vibecheck doctor
4. Scan: npx vibecheck lint

VibeCheck generates configuration in the .opencode/ directory.
After setup, run `npx vibecheck generate` whenever you change vibecheck.config.ts.
```

---

## For GitHub Actions (CI)

```
I want you to set up VibeCheck as a CI quality gate in this project's GitHub Actions workflow.

1. Install: npm install -D @solanticai/vibecheck
2. Initialize: npx vibecheck init
   - Pick presets matching the project stack
   - Select "Claude Code" (or any agent — the CI adapter is always generated)
   - Set protected branches to "main, master"
3. Generate the workflow: npx vibecheck generate

This creates .github/workflows/vibecheck.yml which runs `vibecheck lint` on every PR.
The lint command exits with code 1 if blocking issues are found, failing the check.

To customize the CI output format:
- npx vibecheck lint --format github-actions   (annotates PR files)
- npx vibecheck lint --format json             (machine-readable)
- npx vibecheck lint --format text             (human-readable, default)
```

---

## Available Presets

| Preset | Stack |
|--------|-------|
| `nextjs-15` | Next.js 15 App Router |
| `react-19` | React 19 patterns |
| `typescript-strict` | Strict TypeScript |
| `tailwind` | Tailwind CSS utility-first |
| `supabase` | Supabase best practices |
| `astro` | Astro framework |
| `sveltekit` | SvelteKit |
| `django` | Django/Python |
| `fastapi` | FastAPI/Python |
| `laravel` | Laravel/PHP |
| `python-strict` | Python PEP 8 |
| `go` | Go conventions |

---

## Configuration Reference

After `vibecheck init`, your `vibecheck.config.ts` looks like:

```typescript
import { defineConfig } from '@solanticai/vibecheck';

export default defineConfig({
  presets: ['nextjs-15', 'typescript-strict'],
  agents: ['claude-code'],
  rules: {
    'security/branch-protection': {
      protectedBranches: ['main', 'master'],
    },
  },
  cloud: {
    enabled: true,
    projectId: 'your-project-id',
    autoSync: true,
  },
});
```

See https://github.com/solanticai/VibeCheck for full documentation.
