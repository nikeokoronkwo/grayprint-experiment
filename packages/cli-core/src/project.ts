import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { TemplateCreateInput } from '@grayprint/schemas';

export const PROJECT_CONFIG = 'grayprint.json';

export type ProjectFile = TemplateCreateInput & { $schema?: string };

export function readProject(cwd = process.cwd()): ProjectFile | null {
  const path = resolve(cwd, PROJECT_CONFIG);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8')) as ProjectFile;
}

export function writeProject(file: ProjectFile, cwd = process.cwd()) {
  const path = resolve(cwd, PROJECT_CONFIG);
  writeFileSync(
    path,
    JSON.stringify(
      { $schema: 'https://grayprint.dev/schema/template.json', ...file },
      null,
      2,
    ),
  );
}

export function projectPath(cwd = process.cwd()) {
  return resolve(cwd, PROJECT_CONFIG);
}
