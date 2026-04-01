import type { WalkedFile } from '../walker.js';
import type { AnalyzerResult, DiscoveredPattern } from './types.js';

/**
 * Analyze directory structure conventions.
 *
 * Discovers:
 * - Co-location patterns (component + test + styles together)
 * - Framework conventions (Next.js app router, Django apps)
 * - Common directory organization
 */
export function analyzeStructure(files: WalkedFile[]): AnalyzerResult {
  const patterns: DiscoveredPattern[] = [];

  if (files.length === 0) {
    return { analyzer: 'structure', patterns, filesAnalyzed: 0 };
  }

  // Count files per directory pattern
  const dirCounts = new Map<string, number>();
  const dirExamples = new Map<string, string[]>();

  for (const file of files) {
    const parts = file.directory.split('/');
    // Get last 2 directory segments for context
    const dirKey = parts.slice(-2).join('/').toLowerCase();
    dirCounts.set(dirKey, (dirCounts.get(dirKey) ?? 0) + 1);

    const examples = dirExamples.get(dirKey) ?? [];
    if (examples.length < 3) examples.push(file.path);
    dirExamples.set(dirKey, examples);
  }

  // Detect framework conventions
  const hasAppDir = files.some((f) => f.directory.includes('/app'));
  const hasPagesDir = files.some((f) => f.directory.includes('/pages'));
  const hasSrcDir = files.some((f) => f.directory.includes('/src'));

  if (hasAppDir && hasSrcDir) {
    patterns.push({
      type: 'structure',
      description: 'Next.js App Router structure detected (src/app/)',
      confidence: 0.9,
      occurrences: files.filter((f) => f.directory.includes('/app')).length,
      totalFiles: files.length,
      examples: [],
      promotable: true,
      suggestedRule: {
        ruleId: 'quality/no-use-client-in-pages',
        config: {},
      },
    });
  } else if (hasPagesDir) {
    patterns.push({
      type: 'structure',
      description: 'Next.js Pages Router structure detected',
      confidence: 0.8,
      occurrences: files.filter((f) => f.directory.includes('/pages/')).length,
      totalFiles: files.length,
      examples: [],
      promotable: false,
    });
  }

  // Detect co-location patterns
  const filesByDir = new Map<string, WalkedFile[]>();
  for (const file of files) {
    const existing = filesByDir.get(file.directory) ?? [];
    existing.push(file);
    filesByDir.set(file.directory, existing);
  }

  let colocatedTestCount = 0;
  let totalComponentDirs = 0;

  for (const [, dirFiles] of filesByDir) {
    const hasComponent = dirFiles.some((f) => /\.(tsx|jsx)$/.test(f.filename));
    const hasTest = dirFiles.some((f) => /\.(test|spec)\.(ts|tsx|js|jsx)$/.test(f.filename));

    if (hasComponent) {
      totalComponentDirs++;
      if (hasTest) colocatedTestCount++;
    }
  }

  if (totalComponentDirs > 2) {
    const colocRatio = colocatedTestCount / totalComponentDirs;
    if (colocRatio >= 0.5) {
      patterns.push({
        type: 'structure',
        description: `Co-located tests detected: ${colocatedTestCount}/${totalComponentDirs} component directories have adjacent test files`,
        confidence: colocRatio,
        occurrences: colocatedTestCount,
        totalFiles: totalComponentDirs,
        examples: [],
        promotable: false,
      });
    }
  }

  // Report top-level directory organization
  const topDirs = new Map<string, number>();
  for (const file of files) {
    const relative = file.path.replace(/^.*?\/src\//, 'src/').replace(/^.*?\//, '');
    const topDir = relative.split('/')[0];
    topDirs.set(topDir, (topDirs.get(topDir) ?? 0) + 1);
  }

  const sortedDirs = Array.from(topDirs.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  if (sortedDirs.length > 0) {
    patterns.push({
      type: 'structure',
      description: `Directory layout: ${sortedDirs.map(([d, c]) => `${d}/ (${c})`).join(', ')}`,
      confidence: 1,
      occurrences: files.length,
      totalFiles: files.length,
      examples: [],
      promotable: false,
    });
  }

  return { analyzer: 'structure', patterns, filesAnalyzed: files.length };
}
