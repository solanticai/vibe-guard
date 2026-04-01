import { writeCredentials, getCredentialsPath } from '../../cloud/credentials.js';

/**
 * `vibecheck cloud login`
 *
 * Authenticates with VibeCheck Cloud.
 * In a full implementation, this opens a browser for OAuth flow.
 * For now, accepts a token directly.
 */
export async function cloudLoginCommand(options: { token?: string } = {}): Promise<void> {
  console.log('\n  VibeCheck Cloud — Login\n');

  if (options.token) {
    writeCredentials({
      accessToken: options.token,
    });
    console.log(`  Credentials saved to ${getCredentialsPath()}`);
    console.log('  You are now logged in to VibeCheck Cloud.\n');
    return;
  }

  // Interactive OAuth flow placeholder
  console.log('  To authenticate, visit:');
  console.log('  https://app.vibecheck.dev/cli/auth\n');
  console.log('  Then run:');
  console.log('  vibecheck cloud login --token <your-token>\n');
}
