import { z } from 'zod';
import type { Rule, RuleResult } from '../../types.js';

const configSchema = z.object({
  clientDirs: z.array(z.string()).optional(),
});

/**
 * security/env-exposure
 *
 * Blocks code that imports from `.env` files in client-side code,
 * or logs `process.env` values. Prevents accidental secret exposure
 * in browser bundles.
 */
export const envExposure: Rule = {
  id: 'security/env-exposure',
  name: 'Environment Variable Exposure',
  description: 'Blocks client-side code that accesses .env files or logs environment variables.',
  severity: 'block',
  events: ['PreToolUse'],
  match: { tools: ['Write', 'Edit'] },
  configSchema,

  check: (context): RuleResult => {
    const ruleId = 'security/env-exposure';
    const content = (context.toolInput.content as string) ?? '';
    const filePath = (context.toolInput.file_path as string) ?? '';

    if (!content || !filePath) return { status: 'pass', ruleId };

    const normalized = filePath.replace(/\\/g, '/').toLowerCase();

    // Determine if this is a client-side file
    const ruleConfig = context.projectConfig.rules.get(ruleId);
    const clientDirs = (ruleConfig?.options?.clientDirs as string[]) ?? [
      '/app/',
      '/pages/',
      '/components/',
      '/src/app/',
      '/src/pages/',
      '/src/components/',
    ];

    const isClientFile =
      clientDirs.some((dir) => normalized.includes(dir.toLowerCase())) ||
      normalized.endsWith('.tsx') ||
      normalized.endsWith('.jsx');

    // Skip server-side files
    if (!isClientFile) return { status: 'pass', ruleId };

    // Skip files that are explicitly server-side
    if (
      normalized.includes('/api/') ||
      normalized.includes('/server/') ||
      normalized.endsWith('.server.ts') ||
      normalized.endsWith('.server.tsx') ||
      normalized.includes('route.ts') ||
      normalized.includes('route.tsx')
    ) {
      return { status: 'pass', ruleId };
    }

    // Check for direct .env file imports
    const envImportPattern =
      /(?:import\s+.*\s+from\s+|import\s+|require\s*\()\s*['"]\.?\.?\/?\.[eE][nN][vV]/;
    if (envImportPattern.test(content)) {
      return {
        status: 'block',
        ruleId,
        message: 'Direct import from .env file detected in client-side code.',
        fix: 'Use framework-provided environment variable access (e.g., process.env.NEXT_PUBLIC_* in Next.js) instead of importing .env files directly.',
      };
    }

    // Check for logging process.env values
    const envLogPattern = /console\.\w+\(.*process\.env\b/;
    if (envLogPattern.test(content)) {
      return {
        status: 'block',
        ruleId,
        message: 'Logging process.env values detected — secrets may leak to browser console.',
        fix: 'Remove console.log statements that reference process.env. Use server-side logging instead.',
      };
    }

    // Check for spreading entire process.env
    const envSpreadPattern = /[{=]\s*\.\.\.process\.env\b/;
    if (envSpreadPattern.test(content)) {
      return {
        status: 'block',
        ruleId,
        message: 'Spreading process.env detected — all environment variables would be exposed.',
        fix: 'Access individual environment variables by name instead of spreading the entire object.',
      };
    }

    return { status: 'pass', ruleId };
  },
};
