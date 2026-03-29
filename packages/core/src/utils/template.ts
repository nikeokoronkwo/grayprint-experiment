import { TemplateIdSchema, DynamicTemplateManifestSchema } from '../schemas/template.js'
import type { DynamicTemplateManifest, TemplateId } from '../schemas/template.js'

/**
 * Validates and returns a template manifest — useful in grayprint.config.ts to
 * catch schema errors at definition time rather than at install time.
 *
 * @example
 * ```ts
 * // grayprint.config.ts
 * import { defineTemplate } from '@grayprint/core'
 *
 * export default defineTemplate({
 *   name: 'my-template',
 *   version: '1.0.0',
 *   // ...
 * })
 * ```
 */
export function defineTemplate(manifest: DynamicTemplateManifest): DynamicTemplateManifest {
  return DynamicTemplateManifestSchema.parse(manifest)
}

export function isValidTemplateId(id: unknown): id is TemplateId {
  return TemplateIdSchema.safeParse(id).success
}

export function parseTemplateId(id: unknown): TemplateId {
  return TemplateIdSchema.parse(id)
}

export function safeParseTemplateId(id: unknown): TemplateId | null {
  const result = TemplateIdSchema.safeParse(id)
  return result.success ? result.data : null
}
