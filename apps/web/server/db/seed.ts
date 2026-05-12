import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { randomBytes } from 'node:crypto';
import * as schema from './schema/index';
import type { AiMetadata } from '@grayprint/schemas';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is required to seed. Aborting.');
  process.exit(1);
}

const pool = new Pool({ connectionString: url });
const db = drizzle(pool, { schema, casing: 'snake_case' });

function id(prefix: string) {
  const buf = randomBytes(12).toString('base64url').toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${prefix}_${(Date.now().toString(36) + buf).slice(0, 22)}`;
}

const now = new Date();

const ADMIN_USER = {
  id: id('usr'),
  email: 'hello@grayprint.dev',
  emailVerified: true,
  name: 'Grayprint',
  handle: 'grayprint',
  image: null,
  bio: 'Official Grayprint templates.',
  website: 'https://grayprint.dev',
  role: 'admin',
  createdAt: now,
  updatedAt: now,
};

const CATEGORIES = [
  { id: id('cat'), slug: 'starters', name: 'Starters', description: 'End-to-end opinionated project starters.', icon: 'lucide:rocket', order: 1 },
  { id: id('cat'), slug: 'components', name: 'Components', description: 'Drop-in components and composables.', icon: 'lucide:blocks', order: 2 },
  { id: id('cat'), slug: 'workflows', name: 'Workflows', description: 'Agent-ready and AI-native workflows.', icon: 'lucide:workflow', order: 3 },
];

const TAGS = [
  'nuxt', 'next', 'astro', 'vue', 'react', 'shadcn', 'gsap', 'tailwind', 'auth', 'ai', 'marketing', 'dashboard',
].map((slug) => ({ id: id('tag'), slug, name: slug.charAt(0).toUpperCase() + slug.slice(1), createdAt: now }));

type AiInput = Omit<Partial<AiMetadata>, 'compatibility'> &
  Pick<AiMetadata, 'summary' | 'purpose'> & {
    compatibility?: Partial<AiMetadata['compatibility']>;
  };

function ai(partial: AiInput): AiMetadata {
  const compat = partial.compatibility ?? {};
  return {
    schemaVersion: 'grayprint.ai/v1',
    capabilities: [],
    nonGoals: [],
    components: [],
    requirements: [],
    installHint: '',
    examples: [],
    ...partial,
    compatibility: {
      runtimes: compat.runtimes ?? [],
      frameworks: compat.frameworks ?? [],
      package_managers: compat.package_managers ?? [],
    },
  };
}

const TEMPLATES = [
  {
    slug: 'nuxt-marketing-starter',
    title: 'Nuxt Marketing Starter',
    summary: 'A premium, content-forward marketing site starter with GSAP and shadcn-vue.',
    description:
      'A production-ready Nuxt 3 marketing site with a curated content model, MDC for blog posts, dynamic OG images, theming, and tasteful GSAP entrances. Includes a wired contact form, sitemap, and an opinionated typography scale.',
    kind: 'starter',
    framework: 'nuxt',
    license: 'MIT',
    version: '0.2.0',
    pricing: 'free',
    catSlugs: ['starters'],
    tagSlugs: ['nuxt', 'tailwind', 'gsap', 'shadcn', 'marketing'],
    ai: ai({
      summary: 'Nuxt 3 starter for marketing sites with content, motion, and SEO baked in.',
      purpose:
        'Bootstrap a fast, SEO-strong marketing site without re-inventing the layout, content, or animation primitives every time.',
      capabilities: ['blog with MDC', 'animated hero', 'OG image generation', 'theming'],
      installHint: 'pnpm create grayprint nuxt-marketing-starter my-site',
      compatibility: { runtimes: ['node', 'vercel'], frameworks: ['nuxt'], package_managers: ['pnpm', 'npm'] },
    }),
  },
  {
    slug: 'shadcn-vue-pricing',
    title: 'shadcn-vue Pricing Block',
    summary: 'A drop-in three-tier pricing block — accessible, themeable, conversion-tested.',
    description:
      'A self-contained pricing block built on shadcn-vue primitives. Three plans, monthly/yearly toggle, accent highlight on the recommended tier, FAQ accordion, and full ARIA wiring.',
    kind: 'component',
    framework: 'vue',
    license: 'MIT',
    version: '0.1.3',
    pricing: 'free',
    catSlugs: ['components'],
    tagSlugs: ['vue', 'shadcn', 'tailwind'],
    ai: ai({
      summary: 'Accessible three-tier pricing block in shadcn-vue.',
      purpose:
        'Provide a designer-approved pricing UI you can drop in without rebuilding accordion, toggle, or grid logic.',
      capabilities: ['monthly/yearly toggle', 'recommended tier highlight', 'FAQ accordion'],
      installHint: 'pnpm dlx grayprint add shadcn-vue-pricing',
      compatibility: { frameworks: ['vue', 'nuxt'], package_managers: ['pnpm', 'npm'] },
    }),
  },
  {
    slug: 'next-saas-foundation',
    title: 'Next.js SaaS Foundation',
    summary: 'A pragmatic SaaS starter: auth, billing, dashboard, and admin shells.',
    description:
      'Next.js 15 + App Router with better-auth, Polar billing, Drizzle, and a clean admin shell. Bring your own data — the foundation handles identity, entitlements, and the dashboard chrome.',
    kind: 'starter',
    framework: 'next',
    license: 'MIT',
    version: '0.4.0',
    pricing: 'free',
    catSlugs: ['starters'],
    tagSlugs: ['next', 'react', 'auth', 'tailwind'],
    ai: ai({
      summary: 'Next.js 15 SaaS starter with auth, billing, and dashboard.',
      purpose: 'Skip the first two weeks of every SaaS build. Identity, payments, and admin are pre-wired.',
      capabilities: ['better-auth magic link + OAuth', 'Polar entitlements', 'Drizzle Postgres', 'dashboard shell'],
      compatibility: { frameworks: ['next'], runtimes: ['vercel', 'node'], package_managers: ['pnpm'] },
    }),
  },
  {
    slug: 'astro-docs-kit',
    title: 'Astro Docs Kit',
    summary: 'A minimal, lightning-fast documentation site for libraries and SDKs.',
    description:
      'Astro starter for technical docs: MDX-first, instant search, dark/light, and a structured sidebar config you can hand-edit.',
    kind: 'starter',
    framework: 'astro',
    license: 'MIT',
    version: '0.3.1',
    pricing: 'free',
    catSlugs: ['starters'],
    tagSlugs: ['astro', 'tailwind'],
    ai: ai({
      summary: 'Astro docs starter with MDX, search, and a structured sidebar.',
      purpose: 'Ship documentation for your library in an afternoon — content-driven, no JS frameworks fight.',
      capabilities: ['MDX content', 'instant search', 'dark mode'],
      compatibility: { frameworks: ['astro'], package_managers: ['pnpm', 'npm'] },
    }),
  },
  {
    slug: 'agent-workflow-mcp-starter',
    title: 'Agent Workflow + MCP Starter',
    summary: 'An MCP-ready workflow with an agent loop, tools, and structured output.',
    description:
      'A small Node app that exposes a Model Context Protocol server, a typed tool registry, and a worked example of an agent that reads, plans, and writes — all instrumented for inspection.',
    kind: 'workflow',
    framework: 'agnostic',
    license: 'MIT',
    version: '0.1.0',
    pricing: 'free',
    catSlugs: ['workflows'],
    tagSlugs: ['ai'],
    ai: ai({
      summary: 'MCP-ready agent workflow with a typed tool registry.',
      purpose: 'A clean starting point for agent integrations — bring your model, plug your tools.',
      capabilities: ['MCP stdio + HTTP', 'typed tool registry', 'instrumented agent loop'],
      compatibility: { runtimes: ['node'], package_managers: ['pnpm'] },
    }),
  },
  {
    slug: 'nuxt-dashboard-shell',
    title: 'Nuxt Dashboard Shell',
    summary: 'Production-quality dashboard shell: sidebar, command palette, auth-gated.',
    description:
      'A Nuxt 3 dashboard scaffold with a polished sidebar, command palette (kbar-style), responsive layout, and auth wired via better-auth.',
    kind: 'starter',
    framework: 'nuxt',
    license: 'MIT',
    version: '0.2.4',
    pricing: 'free',
    catSlugs: ['starters'],
    tagSlugs: ['nuxt', 'tailwind', 'auth', 'dashboard'],
    ai: ai({
      summary: 'Nuxt 3 dashboard shell with sidebar, command palette, and auth.',
      purpose: 'Stop reinventing dashboard chrome — start at the feature layer.',
      capabilities: ['sidebar navigation', 'command palette', 'auth-gated routes'],
      compatibility: { frameworks: ['nuxt'], package_managers: ['pnpm'] },
    }),
  },
];

async function main() {
  console.log('• Seeding Grayprint…');
  await db.insert(schema.user).values(ADMIN_USER).onConflictDoNothing();
  await db.insert(schema.category).values(CATEGORIES.map((c) => ({ ...c, createdAt: now, updatedAt: now }))).onConflictDoNothing();
  await db.insert(schema.tag).values(TAGS).onConflictDoNothing();

  const tagBySlug = new Map(TAGS.map((t) => [t.slug, t.id]));
  const catBySlug = new Map(CATEGORIES.map((c) => [c.slug, c.id]));

  for (const t of TEMPLATES) {
    const tid = id('tpl');
    await db
      .insert(schema.template)
      .values({
        id: tid,
        slug: t.slug,
        title: t.title,
        summary: t.summary,
        description: t.description,
        kind: t.kind,
        framework: t.framework,
        license: t.license,
        version: t.version,
        status: 'published',
        visibility: 'public',
        pricing: t.pricing,
        priceCents: 0,
        authorId: ADMIN_USER.id,
        preview: { hero: null, thumbnail: null, gallery: [], demoUrl: null, repoUrl: null },
        install: [{ packageManager: 'pnpm', command: `pnpm create grayprint ${t.slug} my-project` }],
        components: [],
        dependencies: [],
        ai: t.ai,
        polarProductId: null,
        searchKeywords: t.tagSlugs,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoNothing();
    for (const cs of t.catSlugs) {
      const cid = catBySlug.get(cs);
      if (cid) await db.insert(schema.templateCategory).values({ templateId: tid, categoryId: cid }).onConflictDoNothing();
    }
    for (const ts of t.tagSlugs) {
      const ttid = tagBySlug.get(ts);
      if (ttid) await db.insert(schema.templateTag).values({ templateId: tid, tagId: ttid }).onConflictDoNothing();
    }
  }

  console.log('✓ Seed complete.');
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
