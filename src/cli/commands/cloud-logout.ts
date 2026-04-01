import { clearCredentials, hasValidCredentials } from '../../cloud/credentials.js';

/**
 * `vibecheck cloud logout`
 *
 * Removes stored Cloud credentials.
 */
export async function cloudLogoutCommand(): Promise<void> {
  console.log('\n  VibeCheck Cloud — Logout\n');

  if (!hasValidCredentials()) {
    console.log('  Not currently logged in.\n');
    return;
  }

  clearCredentials();
  console.log('  Credentials removed. You are now logged out.\n');
}
