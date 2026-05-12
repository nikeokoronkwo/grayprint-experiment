import { z } from 'zod';
import { aiMetadata } from './ai-metadata.js';
import {
  cuid,
  framework,
  isoDate,
  license,
  pricingModel,
  semver,
  slug,
  status,
  templateKind,
  url,
  visibility,
} from './primitives.js';
import { publicUser } from './user.js';

export const templatePreview = z.object({
  hero: url.nullable().default(null),
  thumbnail: url.nullable().default(null),
  gallery: z.array(url).max(12).default([]),
  demoUrl: url.nullable().default(null),
  repoUrl: url.nullable().default(null),
});
export type TemplatePreview = z.infer<typeof templatePreview>;

export const installInstruction = z.object({
  packageManager: z.enum(['npm', 'pnpm', 'yarn', 'bun']),
  command: z.string().min(1).max(256),
});
export type InstallInstruction = z.infer<typeof installInstruction>;

export const componentRef = z.object({
  name: z.string().min(1).max(64),
  registry: z.enum(['shadcn-vue', 'shadcn', 'custom']).default('shadcn-vue'),
  path: z.string().max(256).optional(),
});
export type ComponentRef = z.infer<typeof componentRef>;

/** Authoritative template record. Mirrors the DB row. */
export const template = z.object({
  id: cuid,
  slug,
  title: z.string().min(1).max(120),
  summary: z.string().min(1).max(240),
  description: z.string().min(1).max(8000),
  kind: templateKind,
  framework,
  license,
  version: semver.default('0.1.0'),
  status: status.default('draft'),
  visibility: visibility.default('public'),
  pricing: pricingModel.default('free'),
  priceCents: z.number().int().nonnegative().default(0),

  authorId: cuid,
  categoryIds: z.array(cuid).default([]),
  tagIds: z.array(cuid).default([]),

  preview: templatePreview.default({}),
  install: z.array(installInstruction).default([]),
  components: z.array(componentRef).default([]),
  dependencies: z
    .array(
      z.object({
        name: z.string(),
        version: z.string().optional(),
        kind: z.enum(['runtime', 'dev', 'peer']).default('runtime'),
      }),
    )
    .default([]),

  ai: aiMetadata,

  /** Polar entitlement product id — required if pricing !== 'free'. Architected, not exposed in Level 0 UI. */
  polarProductId: z.string().max(128).nullable().default(null),

  /** Search doc derived fields (Postgres tsvector lives next to this on the DB row). */
  searchKeywords: z.array(z.string().min(1).max(40)).max(32).default([]),

  publishedAt: isoDate.nullable().default(null),
  createdAt: isoDate,
  updatedAt: isoDate,
});
export type Template = z.infer<typeof template>;

/** Public-facing shape returned by the registry to anonymous readers. */
export const publicTemplate = template
  .omit({ authorId: true, polarProductId: true })
  .extend({
    author: publicUser,
    categories: z
      .array(
        z.object({
          id: cuid,
          slug,
          name: z.string(),
        }),
      )
      .default([]),
    tags: z
      .array(
        z.object({
          id: cuid,
          slug,
          name: z.string(),
        }),
      )
      .default([]),
  });
export type PublicTemplate = z.infer<typeof publicTemplate>;

/** Card-shaped projection for index pages. */
export const templateCard = publicTemplate.pick({
  id: true,
  slug: true,
  title: true,
  summary: true,
  kind: true,
  framework: true,
  pricing: true,
  preview: true,
  author: true,
  categories: true,
  tags: true,
  publishedAt: true,
});
export type TemplateCard = z.infer<typeof templateCard>;

/** Input accepted by POST /api/templates. */
export const templateCreateInput = template
  .pick({
    slug: true,
    title: true,
    summary: true,
    description: true,
    kind: true,
    framework: true,
    license: true,
    version: true,
    visibility: true,
    pricing: true,
    priceCents: true,
    categoryIds: true,
    tagIds: true,
    preview: true,
    install: true,
    components: true,
    dependencies: true,
    ai: true,
  })
  .partial({
    version: true,
    visibility: true,
    pricing: true,
    priceCents: true,
    categoryIds: true,
    tagIds: true,
    preview: true,
    install: true,
    components: true,
    dependencies: true,
  });
export type TemplateCreateInput = z.infer<typeof templateCreateInput>;

export const templateUpdateInput = templateCreateInput.partial();
export type TemplateUpdateInput = z.infer<typeof templateUpdateInput>;
