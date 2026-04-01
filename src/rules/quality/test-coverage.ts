import { existsSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import type { Rule, RuleResult } from '../../types.js';
import { normalizePath, getExtension } from '../../utils/path.js';

const SOURCE_EXTENSIONS = new Set(['ts', 'tsx', 'js', 'jsx']);
const TEST_SUFFIXES = ['.test', '.spec'];
const TEST_EXTENSIONS = ['ts', 'tsx', 'js', 'jsx'];

/**
 * quality/test-coverage
 *
 * Warns when creating a new source file that has no corresponding test file.
 * Skips config files, type files, index files, and test files themselves.
 */
export const testCoverage: Rule = {
  id: 'quality/test-coverage',
  name: 'Test Coverage',
  description: 'Warns when new source files have no corresponding test file.',
  severity: 'warn',
  events: ['PreToolUse'],
  match: { tools: ['Write'] },
  editCheck: false,

  check: (context): RuleResult => {
    const ruleId = 'quality/test-coverage';
    const filePath = (context.toolInput.file_path as string) ?? '';

    if (!filePath) return { status: 'pass', ruleId };

    const ext = getExtension(filePath);
    if (!SOURCE_EXTENSIONS.has(ext)) return { status: 'pass', ruleId };

    const normalized = normalizePath(filePath).toLowerCase();
    const name = basename(filePath);
    const nameBase = name.replace(/\.[^.]+$/, '');

    // Skip files that don't need tests
    if (nameBase === 'index') return { status: 'pass', ruleId };
    if (nameBase.endsWith('.test') || nameBase.endsWith('.spec')) return { status: 'pass', ruleId };
    if (nameBase.endsWith('.d')) return { status: 'pass', ruleId };
    if (name.match(/\.config\./)) return { status: 'pass', ruleId };
    if (normalized.includes('/tests/') || normalized.includes('/__tests__/')) {
      return { status: 'pass', ruleId };
    }

    // Look for a corresponding test file
    const dir = dirname(filePath);
    const testExists = TEST_SUFFIXES.some((suffix) =>
      TEST_EXTENSIONS.some((testExt) => {
        // Check co-located: src/foo.ts → src/foo.test.ts
        const colocated = join(dir, `${nameBase}${suffix}.${testExt}`);
        if (existsSync(colocated)) return true;

        // Check tests/ mirror: src/rules/foo.ts → tests/rules/foo.test.ts
        const testsDir = normalized.replace(/\/src\//, '/tests/');
        if (testsDir !== normalized) {
          const mirrored = join(dirname(testsDir), `${nameBase}${suffix}.${testExt}`);
          if (existsSync(mirrored)) return true;
        }

        return false;
      }),
    );

    if (!testExists) {
      return {
        status: 'warn',
        ruleId,
        message: `No test file found for "${name}". Consider adding tests.`,
        fix: `Create a test file: ${nameBase}.test.${ext}`,
      };
    }

    return { status: 'pass', ruleId };
  },
};
