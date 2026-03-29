import { z } from 'zod'
import { RegistryItemSchema } from '../schemas/registry.js'
import type { RegistryItem, RegistryItemType } from '../schemas/registry.js'

// Derived directly from the schema to avoid duplicating the shape.
export type RegistryItemBuilderOptions = z.input<typeof RegistryItemSchema>

/**
 * Builds and validates a shadcn-compatible registry item.
 * Throws a ZodError if the provided data is invalid.
 *
 * @example
 * ```ts
 * const item = buildRegistryItem({
 *   name: 'my-button',
 *   type: 'registry:component',
 *   title: 'My Button',
 *   description: 'A custom button component',
 *   dependencies: ['class-variance-authority'],
 *   files: [{ path: 'components/my-button.tsx', type: 'registry:component' }],
 * })
 * ```
 */
export function buildRegistryItem(options: RegistryItemBuilderOptions): RegistryItem {
  return RegistryItemSchema.parse(options)
}

function makeTypedBuilder(type: RegistryItemType) {
  return (options: Omit<RegistryItemBuilderOptions, 'type'>): RegistryItem =>
    buildRegistryItem({ ...options, type })
}

export const buildRegistryComponent = makeTypedBuilder('registry:component')
export const buildRegistryBlock = makeTypedBuilder('registry:block')
export const buildRegistryHook = makeTypedBuilder('registry:hook')
export const buildRegistryPage = makeTypedBuilder('registry:page')
