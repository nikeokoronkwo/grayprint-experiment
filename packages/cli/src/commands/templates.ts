import { getActiveAccount, getApiUrl, ui } from '@grayprint/cli-core';
import { GrayprintClient } from '@grayprint/sdk';

function sdk() {
  const active = getActiveAccount();
  return new GrayprintClient({
    apiUrl: active?.host ?? getApiUrl(),
    token: active?.account.token,
  });
}

export const templates = {
  async list(opts: { query?: string }) {
    const res = await sdk().listTemplates({ q: opts.query ?? '', perPage: 24 });
    if (!res.items.length) {
      console.log(ui.warn('No templates match.'));
      return;
    }
    console.log(ui.header(`templates · ${res.total}`));
    for (const t of res.items) {
      console.log(
        `  ${ui.c.bold(t.title.padEnd(36))} ${ui.c.dim(`(${t.kind}/${t.framework})`)}  ${ui.c.cyan(
          t.slug,
        )}`,
      );
    }
  },
  async get(slug: string) {
    const t = await sdk().getTemplate(slug);
    console.log(ui.header(t.title));
    console.log(ui.kv('slug', t.slug));
    console.log(ui.kv('kind', `${t.kind} (${t.framework})`));
    console.log(ui.kv('license', t.license));
    console.log(ui.kv('version', t.version));
    console.log(ui.kv('author', t.author.name ?? t.author.handle ?? '?'));
    console.log(ui.kv('pricing', t.pricing));
    console.log('');
    console.log(`  ${t.summary}`);
  },
};
