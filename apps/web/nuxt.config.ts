// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url';

const isVercel = !!process.env.VERCEL;

export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },

  srcDir: '.',
  serverDir: 'server',

  alias: {
    '@grayprint/schemas': fileURLToPath(new URL('../../packages/schemas/src/index.ts', import.meta.url)),
    '@grayprint/ui': fileURLToPath(new URL('../../packages/ui/src/index.ts', import.meta.url)),
    '@grayprint/ui/tokens': fileURLToPath(new URL('../../packages/ui/src/tokens.ts', import.meta.url)),
    '@grayprint/ui/gsap': fileURLToPath(new URL('../../packages/ui/src/gsap.ts', import.meta.url)),
  },

  modules: [
    '@nuxthub/core',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@vueuse/nuxt',
  ],

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

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: '~/tailwind.config',
    viewer: false,
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

  experimental: {
    typedPages: true,
  },
});
