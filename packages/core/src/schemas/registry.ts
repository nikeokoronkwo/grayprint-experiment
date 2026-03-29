import { z } from 'zod'

export const RegistryItemTypeSchema = z.enum([
  'registry:block',
  'registry:component',
  'registry:hook',
  'registry:page',
  'registry:file',
])

export const RegistryItemFileSchema = z.object({
  path: z.string(),
  type: z.string(),
  target: z.string().optional(),
  content: z.string().optional(),
})

export const RegistryCssVarsSchema = z.object({
  theme: z.record(z.string(), z.string()).optional(),
  light: z.record(z.string(), z.string()).optional(),
  dark: z.record(z.string(), z.string()).optional(),
})

export const RegistryItemSchema = z.object({
  $schema: z.string().optional(),
  name: z.string(),
  type: RegistryItemTypeSchema,
  title: z.string(),
  description: z.string(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(RegistryItemFileSchema).optional(),
  cssVars: RegistryCssVarsSchema.optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
})

export type RegistryItemType = z.infer<typeof RegistryItemTypeSchema>
export type RegistryItemFile = z.infer<typeof RegistryItemFileSchema>
export type RegistryCssVars = z.infer<typeof RegistryCssVarsSchema>
export type RegistryItem = z.infer<typeof RegistryItemSchema>
