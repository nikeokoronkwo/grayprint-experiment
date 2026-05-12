import * as p from '@clack/prompts';
import { getActiveAccount, readProject, ui } from '@grayprint/cli-core';
import { GrayprintClient } from '@grayprint/sdk';

export async function publish(opts: { version?: string; message?: string }) {
  const active = getActiveAccount();
  if (!active) {
    console.error(ui.err('Sign in first: `grayprint login`'));
    process.exit(1);
  }
  const project = readProject();
  if (!project) {
    console.error(ui.err('No grayprint.json found. Run `grayprint init`.'));
    process.exit(1);
  }

  const sdk = new GrayprintClient({ apiUrl: active.host, token: active.account.token });

  p.intro(ui.brand() + '  publish');
  const spinner = p.spinner();
  spinner.start(`Upserting ${ui.c.cyan(project.slug)}…`);

  try {
    let target;
    try {
      target = await sdk.getTemplate(project.slug);
    } catch {
      target = null;
    }
    if (target) {
      await sdk.updateTemplate(project.slug, project);
    } else {
      await sdk.createTemplate(project);
    }
    spinner.stop('Upserted.');

    spinner.start('Publishing…');
    const result = await sdk.publishTemplate(project.slug, {
      version: opts.version ?? project.version,
      changelog: opts.message,
    });
    spinner.stop('Published.');
    p.outro(ui.ok(`Live at ${ui.c.cyan(result.url)} (v${result.version})`));
  } catch (err) {
    spinner.stop('Failed.');
    p.cancel(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}
