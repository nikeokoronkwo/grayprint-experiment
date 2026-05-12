import * as p from '@clack/prompts';
import { clearActiveAccount, getActiveAccount, ui } from '@grayprint/cli-core';

export async function logout() {
  const active = getActiveAccount();
  if (!active) {
    p.log.info('Not signed in.');
    return;
  }
  clearActiveAccount();
  p.outro(ui.ok(`Signed out of ${ui.c.bold(active.account.email)}`));
}
