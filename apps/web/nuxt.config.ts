// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

const isVercel = !!process.env.VERCEL;

export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',
  devtools: { enabled: true },

  // Nuxt 4 defaults: srcDir is 'app/', serverDir is 'server/' at rootDir.
  // We use the v4-native layout — see apps/web/app/.

  alias: {
    '@grayprint/schemas': fileURLToPath(new URL('../../packages/schemas/src/index.ts', import.meta.url)),
    '@grayprint/ui': fileURLToPath(new URL('../../packages/ui/src/index.ts', import.meta.url)),
    '@grayprint/ui/tokens': fileURLToPath(new URL('../../packages/ui/src/tokens.ts', import.meta.url)),
    '@grayprint/ui/gsap': fileURLToPath(new URL('../../packages/ui/src/gsap.ts', import.meta.url)),
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: [
    '@nuxthub/core',
    '@nuxt/content',
    '@nuxtjs/color-mode',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@vueuse/nuxt',
    'nuxt-llms',
  ],

  // Consumed by @nuxtjs/sitemap and @nuxtjs/robots via nuxt-site-config.
  site: {
    url: process.env.PUBLIC_SITE_URL ?? 'http://localhost:3000',
    name: 'Grayprint',
  },

  sitemap: {
    // Router scan can't enumerate dynamic [slug] segments; DB-backed URLs
    // come from /api/__sitemap__/urls instead.
    excludeAppSources: true,
    urls: [
      '/',
      '/templates',
      '/categories',
      '/search',
      '/login',
      '/docs',
      '/docs/publishing',
      '/docs/cli',
      '/docs/mcp',
      '/docs/ai-readability',
    ],
    sources: ['/api/__sitemap__/urls'],
  },

  robots: {
    // The Sitemap: line is emitted automatically from site.url.
    allow: '/',
  },

  llms: {
    domain: process.env.PUBLIC_SITE_URL ?? 'http://localhost:3000',
    title: 'Grayprint',
    description:
      'A dynamic template marketplace where templates are content — discoverable, AI-readable, and built for both humans and agents.',
    full: {
      title: 'Grayprint — full catalogue',
      description:
        'Complete catalogue of published templates with AI-readability metadata (schemaVersion: grayprint.ai/v1).',
    },
    sections: [
      {
        title: 'Surfaces',
        description: 'Public marketplace surfaces — filterable by kind, framework, category, and tag.',
        links: [
          { title: 'Marketplace index', description: 'Browse all published templates.', href: '/templates' },
          { title: 'Template detail', description: 'Public template page with full AI-readability block at /templates/<slug>.', href: '/templates' },
          { title: 'Search', description: 'Full-text search across titles, summaries, and content (/search?q=<query>).', href: '/search' },
          { title: 'Categories', description: 'Browse templates organised by category.', href: '/categories' },
          { title: 'Tags', description: 'Browse templates organised by tag (/tags/<slug>).', href: '/categories' },
        ],
      },
      {
        title: 'Machine endpoints',
        description: 'JSON and authenticated surfaces for agents and automation.',
        links: [
          { title: 'Templates API', description: 'JSON list — supports ?q, ?kind, ?framework, ?category, ?tag, ?page, ?perPage.', href: '/api/templates' },
          { title: 'Template detail API', description: 'JSON detail at /api/templates/<slug>.', href: '/api/templates' },
          { title: 'Categories API', description: 'JSON list of categories.', href: '/api/categories' },
          { title: 'Search API', description: 'JSON search at /api/search?q=<query>.', href: '/api/search' },
          { title: 'MCP transport', description: 'Authenticated Streamable HTTP MCP transport — Authorization: Bearer <agent-api-key>.', href: '/api/mcp' },
        ],
      },
      {
        title: 'AI-readability',
        description:
          'Every public template page embeds a Schema.org SoftwareSourceCode JSON-LD block and an application/grayprint+json block with schemaVersion "grayprint.ai/v1".',
        links: [
          { title: 'AI-readability spec', description: 'Structured AI metadata embedded on every template page.', href: '/docs/ai-readability' },
        ],
      },
      {
        title: 'Auth for agents',
        description:
          'Issue an API key at /dashboard/agents and include it as Authorization: Bearer <key>. Agents authenticate against the same better-auth instance as the web and CLI clients.',
        links: [
          { title: 'Agent API keys', description: 'Manage agent API keys for MCP and registry access.', href: '/dashboard/agents' },
        ],
      },
    ],
    notes: [
      'Templates are content: every public template page is SEO-indexable and machine-readable.',
      'The application/grayprint+json block on each template page uses schemaVersion "grayprint.ai/v1".',
    ],
  },

  hub: {
    // NuxtHub v0.10+ supports a multi-vendor matrix; Postgres works on Vercel & Node alike.
    // Locally, NuxtHub falls back to PGLite when DATABASE_URL is unset.
    database: true as unknown as undefined, // multi-vendor flag — typed for older preset
    blob: true,
    kv: true,
    cache: true,
  } as Record<string, unknown>,

  nitro: {
    preset: isVercel ? 'vercel' : 'node-server',
    experimental: {
      tasks: true,
      openAPI: true,
    },
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  // @nuxt/content v3 — Node 22.5+ ships SQLite natively, so we skip the better-sqlite3 dep.
  content: {
    experimental: { sqliteConnector: 'native' },
  },

  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700, 800] },
      { name: 'JetBrains Mono', provider: 'google', weights: [400, 500, 600] },
    ],
  },

  icon: {
    serverBundle: { collections: ['lucide', 'simple-icons'] },
  },

  runtimeConfig: {
    // Server-only
    databaseUrl: process.env.DATABASE_URL ?? '',
    betterAuthSecret: process.env.BETTER_AUTH_SECRET ?? '',
    betterAuthUrl: process.env.BETTER_AUTH_URL ?? '',
    smtpHost: process.env.SMTP_HOST ?? '',
    smtpPort: process.env.SMTP_PORT ?? '465',
    smtpUser: process.env.SMTP_USER ?? '',
    smtpPass: process.env.SMTP_PASS ?? '',
    smtpFrom: process.env.SMTP_FROM ?? 'Grayprint <hello@grayprint.dev>',
    polarAccessToken: process.env.POLAR_ACCESS_TOKEN ?? '',
    polarWebhookSecret: process.env.POLAR_WEBHOOK_SECRET ?? '',
    polarEnvironment: process.env.POLAR_ENVIRONMENT ?? 'sandbox',
    polarProductProId: process.env.POLAR_PRODUCT_PRO_ID ?? '',
    polarSuccessUrl: process.env.POLAR_SUCCESS_URL ?? '/dashboard/billing',
    blobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN ?? '',
    dubApiKey: process.env.DUB_API_KEY ?? '',
    public: {
      siteUrl: process.env.PUBLIC_SITE_URL ?? 'http://localhost:3000',
      polarEnvironment: process.env.POLAR_ENVIRONMENT ?? 'sandbox',
    },
  },

  app: {
    head: {
      title: 'Grayprint — the blueprint for templates',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'A dynamic template marketplace where templates are content — discoverable, AI-readable, and built for both humans and agents.',
        },
        { name: 'theme-color', content: '#0A1330' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Grayprint' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'mask-icon', href: '/favicon.svg', color: '#0A1330' },
      ],
    },
  },
});
