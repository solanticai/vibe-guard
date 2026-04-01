import { hasValidCredentials } from '../../cloud/credentials.js';
import { CloudClient } from '../../cloud/client.js';

/**
 * `vibecheck cloud connect`
 *
 * Registers the current repository with VibeCheck Cloud.
 * Generates an API key for syncing rule hits.
 */
export async function cloudConnectCommand(options: { name?: string } = {}): Promise<void> {
  const projectRoot = process.cwd();

  console.log('\n  VibeCheck Cloud — Connect Repository\n');

  if (!hasValidCredentials()) {
    console.error('  Not logged in. Run `vibecheck cloud login` first.');
    process.exit(1);
  }

  const projectName = options.name ?? projectRoot.split(/[/\\]/).pop() ?? 'unnamed';

  try {
    const client = new CloudClient();
    const result = await client.connectProject(projectName);

    console.log(`  Project registered: ${projectName}`);
    console.log(`  Project ID: ${result.projectId}`);
    console.log(`  API Key: ${result.apiKey}`);
    console.log('');
    console.log('  Add these to your vibecheck.config.ts:');
    console.log('');
    console.log('  cloud: {');
    console.log('    enabled: true,');
    console.log(`    projectId: "${result.projectId}",`);
    console.log('  }');
    console.log('');
    console.log('  Store the API key as an environment variable:');
    console.log(`  VIBECHECK_API_KEY=${result.apiKey}`);
    console.log('');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`  Failed to connect: ${message}\n`);
    process.exit(1);
  }
}
