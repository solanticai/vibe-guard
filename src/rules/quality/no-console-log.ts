import { z } from 'zod';
import type { Rule, RuleResult } from '../../types.js';

const configSchema = z.object({
  allowInTests: z.boolean().optional(),
  allowInScripts: z.boolean().optional(),
});

/**
 * quality/no-console-log
 *
 * Flags `console.log` in production source files.
 * Allows in test files and scripts/ directories by default.
 */
export const noConsoleLog: Rule = {
  id: 'quality/no-console-log',
  name: 'No Console Log',
  description: 'Flags console.log statements in production source files.',
  severity: 'warn',
  events: ['PreToolUse'],
  match: { tools: ['Write', 'Edit'] },
  configSchema,

  check: (context): RuleResult => {
    const ruleId = 'quality/no-console-log';
    const content = (context.toolInput.content as string) ?? '';
    const filePath = (context.toolInput.file_path as string) ?? '';

    if (!content || !filePath) return { status: 'pass', ruleId };

    const normalized = filePath.replace(/\\/g, '/').toLowerCase();
    const ext = filePath.split('.').pop()?.toLowerCase() ?? '';

    // Only check source files
    const sourceExts = ['ts', 'tsx', 'js', 'jsx', 'mts', 'mjs'];
    if (!sourceExts.includes(ext)) return { status: 'pass', ruleId };

    const ruleConfig = context.projectConfig.rules.get(ruleId);
    const allowInTests = (ruleConfig?.options?.allowInTests as boolean) ?? true;
    const allowInScripts = (ruleConfig?.options?.allowInScripts as boolean) ?? true;

    // Skip test files
    if (allowInTests) {
      if (
        normalized.includes('.test.') ||
        normalized.includes('.spec.') ||
        normalized.includes('__tests__/') ||
        normalized.includes('/test/') ||
        normalized.includes('/tests/')
      ) {
        return { status: 'pass', ruleId };
      }
    }

    // Skip scripts directories
    if (allowInScripts) {
      if (normalized.includes('/scripts/') || normalized.includes('/bin/')) {
        return { status: 'pass', ruleId };
      }
    }

    // Find console.log statements (but not console.error, console.warn, etc.)
    const consoleLogPattern = /\bconsole\.log\s*\(/g;
    const matches: string[] = [];
    let match;

    while ((match = consoleLogPattern.exec(content)) !== null) {
      // Get the line containing the match for context
      const lineStart = content.lastIndexOf('\n', match.index) + 1;
      const lineEnd = content.indexOf('\n', match.index);
      const line = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();
      matches.push(line);
    }

    if (matches.length > 0) {
      return {
        status: 'warn',
        ruleId,
        message: `Found ${matches.length} console.log statement${matches.length > 1 ? 's' : ''} in production code.`,
        fix: 'Remove console.log or replace with a proper logger. Use console.error/warn for actual diagnostics.',
        metadata: { count: matches.length, firstMatch: matches[0] },
      };
    }

    return { status: 'pass', ruleId };
  },
};
