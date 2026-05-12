import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as p from '@clack/prompts';
import { projectPath, readProject, ui, writeProject } from '@grayprint/cli-core';
import type { TemplateCreateInput } from '@grayprint/schemas';

export async function init() {
  const cwd = process.cwd();
  if (readProject(cwd)) {
    p.log.warn(`grayprint.json already exists at ${ui.c.cyan(projectPath(cwd))}.`);
    return;
  }

  const pkgPath = join(cwd, 'package.json');
  const pkg = existsSync(pkgPath) ? (JSON.parse(readFileSync(pkgPath, 'utf8')) as Record<string, unknown>) : {};

  p.intro(ui.brand() + '  init');

  const answers = await p.group(
    {
      slug: () =>
        p.text({
          message: 'Template slug',
          initialValue: (pkg.name as string)?.replace(/^@.*\//, '') ?? '',
          validate: (v) =>
            /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(v ?? '')
              ? undefined
              : 'lowercase, digits, hyphens',
        }),
      title: () => p.text({ message: 'Title', initialValue: (pkg.name as string) ?? '' }),
      summary: () =>
        p.text({
          message: 'One-line summary',
          initialValue: (pkg.description as string) ?? '',
        }),
      kind: () =>
        p.select({
          message: 'Kind',
          options: [
            { value: 'starter', label: 'Starter (full project)' },
            { value: 'component', label: 'Component (drop-in piece)' },
            { value: 'theme', label: 'Theme' },
            { value: 'snippet', label: 'Snippet' },
            { value: 'workflow', label: 'Workflow / agent recipe' },
            { value: 'app', label: 'App' },
          ],
          initialValue: 'starter',
        }),
      framework: () =>
        p.select({
          message: 'Framework',
          options: [
            { value: 'nuxt', label: 'Nuxt' },
            { value: 'next', label: 'Next.js' },
            { value: 'astro', label: 'Astro' },
            { value: 'vue', label: 'Vue' },
            { value: 'react', label: 'React' },
            { value: 'svelte', label: 'Svelte' },
            { value: 'agnostic', label: 'Framework-agnostic' },
          ],
          initialValue: 'nuxt',
        }),
      license: () =>
        p.select({
          message: 'License',
          options: ['MIT', 'Apache-2.0', 'ISC', 'BSD-3-Clause', 'Proprietary'].map((l) => ({
            value: l,
            label: l,
          })),
          initialValue: 'MIT',
        }),
      purpose: () =>
        p.text({
          message: 'What is this template for? (one paragraph for agents)',
        }),
    },
    {
      onCancel: () => {
        p.cancel('Cancelled.');
        process.exit(0);
      },
    },
  );

  const file: TemplateCreateInput = {
    slug: answers.slug as string,
    title: (answers.title as string) || (answers.slug as string),
    summary: (answers.summary as string) || (answers.title as string),
    description: (answers.summary as string) || '',
    kind: answers.kind as TemplateCreateInput['kind'],
    framework: answers.framework as TemplateCreateInput['framework'],
    license: answers.license as TemplateCreateInput['license'],
    version: (pkg.version as string) ?? '0.1.0',
    ai: {
      schemaVersion: 'grayprint.ai/v1',
      summary: (answers.summary as string) || (answers.title as string) || (answers.slug as string),
      purpose: (answers.purpose as string) || '',
      capabilities: [],
      nonGoals: [],
      components: [],
      requirements: [],
      installHint: `pnpm create grayprint ${answers.slug} my-project`,
      examples: [],
      compatibility: {
        runtimes: [],
        frameworks: [String(answers.framework)],
        package_managers: [],
      },
    },
  };

  writeProject(file, cwd);
  p.outro(ui.ok(`Wrote ${ui.c.cyan('grayprint.json')}.`));
}
