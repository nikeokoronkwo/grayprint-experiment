import { z } from 'zod';

export const slug = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, 'lowercase, digits, and hyphens only');

export const semver = z
  .string()
  .regex(
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/,
    'must be a valid semver',
  );

export const cuid = z.string().min(8).max(128);
export const url = z.string().url();
export const isoDate = z.string().datetime({ offset: true });

export const visibility = z.enum(['public', 'unlisted', 'private']);
export type Visibility = z.infer<typeof visibility>;

export const status = z.enum(['draft', 'published', 'archived']);
export type Status = z.infer<typeof status>;

export const templateKind = z.enum([
  'app',
  'component',
  'starter',
  'snippet',
  'theme',
  'workflow',
]);
export type TemplateKind = z.infer<typeof templateKind>;

export const framework = z.enum([
  'nuxt',
  'next',
  'sveltekit',
  'remix',
  'astro',
  'vue',
  'react',
  'svelte',
  'solid',
  'angular',
  'agnostic',
]);
export type Framework = z.infer<typeof framework>;

export const license = z.enum([
  'MIT',
  'Apache-2.0',
  'GPL-3.0',
  'BSD-3-Clause',
  'ISC',
  'MPL-2.0',
  'Unlicense',
  'Proprietary',
]);
export type License = z.infer<typeof license>;

export const pricingModel = z.enum(['free', 'one-time', 'subscription']);
export type PricingModel = z.infer<typeof pricingModel>;
