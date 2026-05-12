import { z } from 'zod';

/**
 * AI-readability spec for a template. This is the machine-facing surface — embedded
 * verbatim on template pages as <script type="application/grayprint+json"> and served
 * over the registry API. Keep it stable; bump `schemaVersion` if you must break.
 */
export const aiMetadata = z.object({
  schemaVersion: z.literal('grayprint.ai/v1').default('grayprint.ai/v1'),
  summary: z.string().min(1).max(280),
  /** What this template is *for* — the problem it solves, in one paragraph. */
  purpose: z.string().min(1).max(1000),
  /** Concrete capabilities or features an agent might want to reason about. */
  capabilities: z.array(z.string().min(1).max(120)).max(32).default([]),
  /** Non-goals — things explicitly out of scope. Helps agents avoid hallucinated promises. */
  nonGoals: z.array(z.string().min(1).max(160)).max(16).default([]),
  /** Composable building blocks contributed by this template. */
  components: z
    .array(
      z.object({
        name: z.string().min(1).max(64),
        description: z.string().max(280).default(''),
        kind: z.enum(['component', 'composable', 'route', 'middleware', 'plugin', 'util']),
        path: z.string().max(256).optional(),
      }),
    )
    .max(64)
    .default([]),
  /** Required peer / runtime / build dependencies the consumer must already provide. */
  requirements: z
    .array(
      z.object({
        name: z.string().min(1).max(64),
        version: z.string().max(32).optional(),
        kind: z.enum(['package', 'runtime', 'service', 'env']),
      }),
    )
    .default([]),
  /** Single-paragraph install/use hint, plain prose for LLM consumption. */
  installHint: z.string().max(600).default(''),
  /** Example invocations or usage prompts; each entry is a self-contained block. */
  examples: z
    .array(
      z.object({
        title: z.string().min(1).max(80),
        body: z.string().min(1).max(2000),
        language: z.string().max(16).optional(),
      }),
    )
    .max(8)
    .default([]),
  /** Compatibility matrix — what frameworks/runtimes this template works with. */
  compatibility: z
    .object({
      runtimes: z.array(z.string()).default([]),
      frameworks: z.array(z.string()).default([]),
      package_managers: z.array(z.enum(['npm', 'pnpm', 'yarn', 'bun', 'deno'])).default([]),
    })
    .default({}),
});
export type AiMetadata = z.infer<typeof aiMetadata>;
