import { z } from 'zod'

export const TemplateIdSchema = z
  .string()
  .regex(
    /^[a-z0-9]([a-z0-9-_]*[a-z0-9])?(@[a-z0-9.-]+\/[a-z0-9-_]+)?$/,
    'Invalid template ID format'
  )

export const TemplateTypeSchema = z.enum([
  'template',
  'component',
  'block',
  'page',
  'hook',
  'utility',
])

export const TemplateFrameworkSchema = z.enum([
  'react',
  'vue',
  'nuxt',
  'next',
  'svelte',
  'astro',
  'angular',
  'vanilla',
])

export const TemplatePricingSchema = z.enum(['free', 'paid', 'subscription'])

export const TemplateOptionChoiceSchema = z.object({
  value: z.string(),
  label: z.string(),
})

export const TemplateOptionSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: z.enum(['text', 'select', 'multiselect', 'boolean', 'number']),
  required: z.boolean().optional(),
  default: z.unknown().optional(),
  choices: z.array(TemplateOptionChoiceSchema).optional(),
  when: z.string().optional(),
})

export const DynamicTemplateFileSchema = z.object({
  src: z.string(),
  dest: z.string(),
  when: z.string().optional(),
})

export const DynamicTemplateHooksSchema = z.object({
  postInstall: z.string().optional(),
  preInstall: z.string().optional(),
})

export const DynamicTemplateManifestSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string(),
  framework: TemplateFrameworkSchema,
  type: TemplateTypeSchema,
  options: z.array(TemplateOptionSchema).optional(),
  files: z.array(DynamicTemplateFileSchema),
  dependencies: z.record(z.string(), z.string()).optional(),
  devDependencies: z.record(z.string(), z.string()).optional(),
  hooks: DynamicTemplateHooksSchema.optional(),
})

export const TemplateAuthorSchema = z.object({
  id: z.string(),
  username: z.string(),
  avatarUrl: z.string().url().optional(),
})

export const TemplateSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  type: TemplateTypeSchema,
  framework: z.array(TemplateFrameworkSchema),
  pricing: TemplatePricingSchema,
  price: z.number().int().nonnegative().optional(),
  authorId: z.string(),
  author: TemplateAuthorSchema,
  githubUrl: z.string().url().optional(),
  previewUrl: z.string().url().optional(),
  screenshots: z.array(z.string().url()),
  tags: z.array(z.string()),
  downloads: z.number().int().nonnegative(),
  stars: z.number().int().nonnegative(),
  version: z.string(),
  isDynamic: z.boolean(),
  manifest: DynamicTemplateManifestSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type TemplateId = z.infer<typeof TemplateIdSchema>
export type TemplateType = z.infer<typeof TemplateTypeSchema>
export type TemplateFramework = z.infer<typeof TemplateFrameworkSchema>
export type TemplatePricing = z.infer<typeof TemplatePricingSchema>
export type TemplateOptionChoice = z.infer<typeof TemplateOptionChoiceSchema>
export type TemplateOption = z.infer<typeof TemplateOptionSchema>
export type DynamicTemplateFile = z.infer<typeof DynamicTemplateFileSchema>
export type DynamicTemplateHooks = z.infer<typeof DynamicTemplateHooksSchema>
export type DynamicTemplateManifest = z.infer<typeof DynamicTemplateManifestSchema>
export type TemplateAuthor = z.infer<typeof TemplateAuthorSchema>
export type Template = z.infer<typeof TemplateSchema>
