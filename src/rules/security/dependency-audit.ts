import type { Rule, RuleResult } from '../../types.js';

/**
 * Known vulnerable or malicious package patterns.
 * This is a lightweight check — for full auditing, use `npm audit`.
 */
const SUSPICIOUS_PATTERNS: Array<[RegExp, string]> = [
  [
    /npm\s+install\s+.*--ignore-scripts\s*=?\s*false/i,
    'Installing with scripts enabled explicitly',
  ],
  [/npm\s+install\s+.*https?:\/\//i, 'Installing package from URL (not registry)'],
  [/pip\s+install\s+.*--trusted-host/i, 'Installing from untrusted host'],
  [/pip\s+install\s+.*http:\/\//i, 'Installing Python package over HTTP (insecure)'],
  [/curl\s+.*\|\s*pip\s+install/i, 'Piping curl output to pip install'],
];

/**
 * security/dependency-audit
 *
 * Warns about potentially dangerous package installation commands.
 * Runs as PostToolUse on Bash commands that install packages.
 */
export const dependencyAudit: Rule = {
  id: 'security/dependency-audit',
  name: 'Dependency Audit',
  description: 'Flags potentially dangerous package installation patterns.',
  severity: 'warn',
  events: ['PostToolUse'],
  match: { tools: ['Bash'] },
  editCheck: false,

  check: (context): RuleResult => {
    const ruleId = 'security/dependency-audit';
    const command = (context.toolInput.command as string) ?? '';

    if (!command) return { status: 'pass', ruleId };

    // Only check install commands
    const isInstall =
      /npm\s+install\b/i.test(command) ||
      /yarn\s+add\b/i.test(command) ||
      /pnpm\s+add\b/i.test(command) ||
      /pip\s+install\b/i.test(command) ||
      /pip3\s+install\b/i.test(command);

    if (!isInstall) return { status: 'pass', ruleId };

    for (const [pattern, description] of SUSPICIOUS_PATTERNS) {
      if (pattern.test(command)) {
        return {
          status: 'warn',
          ruleId,
          message: `Suspicious install pattern: ${description}.`,
          fix: 'Review the package source. Use `npm audit` or `pip-audit` to check for vulnerabilities.',
          metadata: { command, pattern: description },
        };
      }
    }

    return { status: 'pass', ruleId };
  },
};
