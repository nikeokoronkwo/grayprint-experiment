import * as p from '@clack/prompts';
import { getActiveAccount, ui } from '@grayprint/cli-core';
import { GrayprintClient } from '@grayprint/sdk';

function sdk() {
  const active = getActiveAccount();
  if (!active) {
    console.error(ui.err('Sign in first: `grayprint login`'));
    process.exit(1);
  }
  return new GrayprintClient({ apiUrl: active.host, token: active.account.token });
}

export const agents = {
  async create(name: string) {
    p.intro(ui.brand() + '  agents create');
    const spinner = p.spinner();
    spinner.start(`Issuing key ${ui.c.cyan(name)}…`);
    const res = await sdk().createAgentKey({ name });
    spinner.stop('Issued.');
    p.log.warn(ui.c.yellow('Copy this — it is shown only once:'));
    p.log.message(`\n  ${ui.c.bold(ui.c.green(res.key))}\n`);
    p.outro(ui.ok(`Save it somewhere safe.`));
  },
  async list() {
    const rows = (await sdk().listAgentKeys()) as Array<{
      id: string;
      name: string;
      start?: string;
      lastRequest?: string | null;
    }>;
    if (!rows.length) {
      console.log(ui.warn('No agent keys yet.'));
      return;
    }
    console.log(ui.header('agents'));
    for (const r of rows) {
      console.log(
        `  ${ui.c.bold(r.name.padEnd(20))} ${ui.c.dim(r.start ?? '••••')}…  ${ui.c.cyan(r.id)}`,
      );
    }
  },
  async revoke(id: string) {
    await sdk().revokeAgentKey(id);
    console.log(ui.ok(`Revoked ${ui.c.cyan(id)}.`));
  },
};
