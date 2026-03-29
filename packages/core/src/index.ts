// Template schemas and types
export {
  TemplateIdSchema,
  TemplateTypeSchema,
  TemplateFrameworkSchema,
  TemplatePricingSchema,
  TemplateOptionChoiceSchema,
  TemplateOptionSchema,
  DynamicTemplateFileSchema,
  DynamicTemplateHooksSchema,
  DynamicTemplateManifestSchema,
  TemplateAuthorSchema,
  TemplateSchema,
} from './schemas/template.js'

export type {
  TemplateId,
  TemplateType,
  TemplateFramework,
  TemplatePricing,
  TemplateOptionChoice,
  TemplateOption,
  DynamicTemplateFile,
  DynamicTemplateHooks,
  DynamicTemplateManifest,
  TemplateAuthor,
  Template,
} from './schemas/template.js'

// Registry schemas and types
export {
  RegistryItemTypeSchema,
  RegistryItemFileSchema,
  RegistryCssVarsSchema,
  RegistryItemSchema,
} from './schemas/registry.js'

export type {
  RegistryItemType,
  RegistryItemFile,
  RegistryCssVars,
  RegistryItem,
} from './schemas/registry.js'

// User and organization schemas and types
export {
  UserRoleSchema,
  UserSchema,
  OrganizationPlanSchema,
  OrganizationSchema,
} from './schemas/user.js'

export type { UserRole, User, OrganizationPlan, Organization } from './schemas/user.js'

// Purchase schemas and types
export { PurchaseSchema } from './schemas/purchase.js'
export type { Purchase } from './schemas/purchase.js'

// Template utilities
export {
  defineTemplate,
  isValidTemplateId,
  parseTemplateId,
  safeParseTemplateId,
} from './utils/template.js'

// Registry builders
export {
  buildRegistryItem,
  buildRegistryComponent,
  buildRegistryBlock,
  buildRegistryHook,
  buildRegistryPage,
} from './utils/registry.js'

export type { RegistryItemBuilderOptions } from './utils/registry.js'
