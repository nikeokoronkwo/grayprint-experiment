# @grayprint/core

Shared TypeScript types, Zod schemas, and utility functions for the Grayprint template marketplace platform.

## Installation

```bash
pnpm add @grayprint/core
```

## Usage

### Defining a template manifest

Use `defineTemplate` in your `grayprint.config.ts` for full type inference:

```ts
import { defineTemplate } from '@grayprint/core'

export default defineTemplate({
  name: 'my-dashboard',
  version: '1.0.0',
  description: 'A responsive admin dashboard',
  framework: 'react',
  type: 'template',
  options: [
    {
      name: 'theme',
      label: 'Color theme',
      type: 'select',
      default: 'light',
      choices: [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
      ],
    },
  ],
  files: [
    { src: 'src/**/*', dest: 'src/' },
  ],
  dependencies: {
    'react': '^18.0.0',
    'react-dom': '^18.0.0',
  },
})
```

### Building a shadcn-compatible registry item

```ts
import { buildRegistryComponent } from '@grayprint/core'

const button = buildRegistryComponent({
  name: 'my-button',
  title: 'My Button',
  description: 'A custom button with variants',
  dependencies: ['class-variance-authority'],
  files: [
    { path: 'components/my-button.tsx', type: 'registry:component' },
  ],
  cssVars: {
    light: { '--button-radius': '0.5rem' },
    dark: { '--button-radius': '0.5rem' },
  },
})
```

### Validating template IDs

```ts
import { isValidTemplateId, parseTemplateId } from '@grayprint/core'

isValidTemplateId('my-template')           // true
isValidTemplateId('my-template@org/repo')  // true
isValidTemplateId('Invalid Template')      // false

parseTemplateId('my-template')  // returns 'my-template' or throws ZodError
```

## Exports

### Schemas

All Zod schemas are exported for use in validation:

- `TemplateIdSchema` — template ID regex validation
- `TemplateTypeSchema` — template type enum
- `TemplateFrameworkSchema` — supported frameworks
- `TemplatePricingSchema` — pricing model enum
- `TemplateOptionSchema` — dynamic template option
- `DynamicTemplateManifestSchema` — full manifest schema
- `TemplateSchema` — complete template entity
- `RegistryItemSchema` — shadcn-compatible registry item
- `UserSchema`, `OrganizationSchema`, `PurchaseSchema`

### Types

TypeScript types are inferred from schemas:

- `TemplateId`, `TemplateType`, `TemplateFramework`, `TemplatePricing`
- `TemplateOption`, `DynamicTemplateManifest`, `Template`
- `RegistryItem`, `RegistryItemType`, `RegistryCssVars`
- `User`, `UserRole`, `Organization`, `OrganizationPlan`
- `Purchase`

### Utilities

- `defineTemplate(manifest)` — identity function for type-safe config files
- `isValidTemplateId(id)` — type guard for template IDs
- `parseTemplateId(id)` — parse with validation
- `safeParseTemplateId(id)` — parse returning null on failure
- `buildRegistryItem(options)` — build a registry item
- `buildRegistryComponent/Block/Hook/Page(options)` — typed registry builders
