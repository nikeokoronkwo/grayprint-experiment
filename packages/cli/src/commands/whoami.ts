import { getActiveAccount, ui } from '@grayprint/cli-core';

export async function whoami() {
  const active = getActiveAccount();
  if (!active) {
    console.log(ui.warn('Not signed in. Run `grayprint login`.'));
    process.exit(1);
  }
  console.log(ui.header('whoami'));
  console.log(ui.kv('host', active.host));
  console.log(ui.kv('email', active.account.email));
  console.log(ui.kv('userId', active.account.userId));
  if (active.account.handle) console.log(ui.kv('handle', `@${active.account.handle}`));
}
