import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import { getApiUrl, ui } from '@grayprint/cli-core';
import { GrayprintClient } from '@grayprint/sdk';

async function main() {
  const args = process.argv.slice(2);
  const target = args[0];

  p.intro(ui.brand() + '  create');

  const sdk = new GrayprintClient({ apiUrl: getApiUrl() });

  const spinner = p.spinner();
  spinner.start('Fetching templates…');
  let starters: Awaited<ReturnType<typeof sdk.listTemplates>>['items'] = [];
  try {
    const res = await sdk.listTemplates({ kind: 'starter', perPage: 24 });
    starters = res.items;
    spinner.stop(`Loaded ${starters.length} starters.`);
  } catch (err) {
    spinner.stop(pc.yellow('Could not reach the registry.'));
    p.log.warn(`Falling back to a built-in starter. (${err instanceof Error ? err.message : err})`);
  }

  const choices = starters.length
    ? starters.map((s) => ({
        value: s.slug,
        label: s.title,
        hint: `${s.framework} · ${s.summary.slice(0, 60)}`,
      }))
    : [{ value: 'nuxt-marketing-starter', label: 'Nuxt Marketing Starter', hint: 'fallback' }];

  const answers = await p.group(
    {
      slug: () =>
        p.select({
          message: 'Pick a template',
          options: choices,
          initialValue: choices[0]?.value,
        }),
      dir: () =>
        p.text({
          message: 'Where should we create it?',
          initialValue: target ?? './my-grayprint-app',
          validate: (v) => {
            if (!v) return 'required';
            const full = resolve(process.cwd(), v);
            if (existsSync(full) && readdirSync(full).length > 0)
              return 'directory is not empty';
            return undefined;
          },
        }),
      pm: () =>
        p.select({
          message: 'Package manager',
          options: [
            { value: 'pnpm', label: 'pnpm' },
            { value: 'npm', label: 'npm' },
            { value: 'yarn', label: 'yarn' },
            { value: 'bun', label: 'bun' },
          ],
          initialValue: 'pnpm',
        }),
      install: () =>
        p.confirm({ message: 'Install dependencies now?', initialValue: true }),
    },
    {
      onCancel: () => {
        p.cancel('Cancelled.');
        process.exit(0);
      },
    },
  );

  const fullPath = resolve(process.cwd(), answers.dir as string);
  mkdirSync(fullPath, { recursive: true });

  // Level-0 scaffold note: we render a minimal package.json + README pointing at the chosen
  // template. Mature scaffolding (downloading a release tarball / git tree) is a follow-up.
  const pkg = {
    name: (answers.dir as string).replace(/^\.\//, '').replace(/[^a-zA-Z0-9-]/g, '-'),
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: { dev: 'echo "Replace me with the template\'s dev command"' },
  };
  const fs = await import('node:fs/promises');
  await fs.writeFile(resolve(fullPath, 'package.json'), JSON.stringify(pkg, null, 2));
  await fs.writeFile(
    resolve(fullPath, 'README.md'),
    `# ${pkg.name}\n\nScaffolded from \`${answers.slug}\`.\n\nSee https://grayprint.dev/templates/${answers.slug} for full setup instructions.\n`,
  );
  await fs.writeFile(
    resolve(fullPath, 'grayprint.json'),
    JSON.stringify({ template: answers.slug, createdAt: new Date().toISOString() }, null, 2),
  );

  if (answers.install) {
    p.log.message(`Installing with ${pc.cyan(answers.pm as string)}…`);
    spawnSync(answers.pm as string, ['install'], { cwd: fullPath, stdio: 'inherit' });
  }

  p.outro(
    `${ui.ok('Created.')}\n  ${pc.dim('cd')} ${pc.cyan(answers.dir as string)}\n  ${pc.dim(answers.pm)} ${pc.cyan('dev')}\n  → ${pc.dim('Visit')} ${pc.cyan(`https://grayprint.dev/templates/${answers.slug}`)} ${pc.dim('for the full guide.')}`,
  );
}

main().catch((err) => {
  console.error(pc.red('✗'), err instanceof Error ? err.message : String(err));
  process.exit(1);
});
