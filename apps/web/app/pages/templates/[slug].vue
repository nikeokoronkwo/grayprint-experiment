<script setup lang="ts">
import type { PublicTemplate } from '@grayprint/schemas';

const route = useRoute();
const slug = route.params.slug as string;

const { data, error } = await useAsyncData(`tpl:${slug}`, () =>
  $fetch(`/api/templates/${slug}`),
);

if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Template not found' });
}

const t = data.value!;

useSeoMeta({
  title: t.title,
  description: t.summary,
  ogTitle: `${t.title} — Grayprint`,
  ogDescription: t.summary,
  ogType: 'article',
  ogImage: t.preview?.hero ?? `/og/${t.slug}.png`,
  twitterCard: 'summary_large_image',
});

const config = useRuntimeConfig();
const canonical = computed(() => `${config.public.siteUrl}/templates/${t.slug}`);

const jsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: t.title,
  description: t.summary,
  codeRepository: t.preview?.repoUrl ?? undefined,
  programmingLanguage: t.framework,
  license: `https://spdx.org/licenses/${t.license}.html`,
  url: canonical.value,
  datePublished: t.publishedAt,
  dateModified: t.updatedAt,
  author: {
    '@type': 'Person',
    name: t.author?.name ?? t.author?.handle ?? 'Grayprint',
    url: t.author?.website ?? undefined,
  },
  keywords: [...t.tags.map((x) => x.name), ...t.categories.map((c) => c.name)].join(', '),
}));

const grayprintJson = computed(() => ({
  slug: t.slug,
  url: canonical.value,
  ...t.ai,
}));

useHead({
  link: [{ rel: 'canonical', href: canonical.value }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(jsonLd.value),
    },
    {
      type: 'application/grayprint+json',
      innerHTML: JSON.stringify(grayprintJson.value),
    },
  ],
});

const installSnippet = computed(
  () =>
    t.install?.find((i) => i.packageManager === 'pnpm')?.command ??
    `pnpm create grayprint ${t.slug} my-project`,
);
</script>

<template>
  <main>
    <div class="relative overflow-hidden border-b border-ink/10 bg-paper dark:border-paper/10 dark:bg-ink">
      <div
        class="pointer-events-none absolute inset-0 opacity-100"
        :style="{
          backgroundImage:
            'linear-gradient(to right, rgba(59,130,246,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,0.10) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-paper/30 to-paper dark:via-ink/30 dark:to-ink"
        aria-hidden="true"
      />
      <div class="relative mx-auto max-w-6xl px-6 py-12">
        <div class="flex items-center gap-2 text-xs text-ink/55 dark:text-paper/55">
          <NuxtLink to="/templates" class="hover:text-blueprint-700 dark:hover:text-blueprint-300">Templates</NuxtLink>
          <Icon name="lucide:chevron-right" class="h-3 w-3" />
          <NuxtLink
            v-if="t.categories[0]"
            :to="`/categories/${t.categories[0].slug}`"
            class="hover:text-blueprint-700 dark:hover:text-blueprint-300"
          >
            {{ t.categories[0].name }}
          </NuxtLink>
          <Icon v-if="t.categories[0]" name="lucide:chevron-right" class="h-3 w-3" />
          <span class="text-ink/70 dark:text-paper/80">{{ t.title }}</span>
        </div>

        <div class="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div class="max-w-2xl">
            <div class="flex flex-wrap gap-2">
              <span class="chip border-ink/20 bg-paper">{{ t.kind }}</span>
              <span class="chip border-blueprint-300 bg-blueprint-50 text-blueprint-800">
                {{ t.framework }}
              </span>
              <span class="chip">{{ t.license }}</span>
              <span
                class="chip"
                :class="
                  t.pricing === 'free'
                    ? 'border-accent-400 bg-accent-100 text-ink'
                    : 'border-spark-300 bg-spark-50 text-spark-700'
                "
              >
                {{ t.pricing }}
              </span>
            </div>
            <h1
              class="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight text-ink dark:text-paper sm:text-6xl"
            >
              {{ t.title }}
            </h1>
            <p class="mt-5 text-pretty text-lg leading-relaxed text-ink/70 dark:text-paper/70">{{ t.summary }}</p>
            <div class="mt-7 flex flex-wrap items-center gap-3 text-sm text-ink/60 dark:text-paper/60">
              <div class="flex items-center gap-2">
                <div
                  class="grid h-7 w-7 place-items-center rounded-full bg-ink text-paper ring-1 ring-ink/10"
                >
                  <span class="font-mono text-[11px] font-bold">
                    {{ (t.author.handle ?? '?').slice(0, 1).toUpperCase() }}
                  </span>
                </div>
                <span>by <span class="text-ink/85 dark:text-paper/85">{{ t.author.name ?? t.author.handle }}</span></span>
              </div>
              <span class="text-ink/25 dark:text-paper/25">·</span>
              <span class="font-mono text-xs">v{{ t.version }}</span>
              <span v-if="t.publishedAt" class="text-ink/25 dark:text-paper/25">·</span>
              <span v-if="t.publishedAt">
                Published {{ new Date(t.publishedAt).toLocaleDateString() }}
              </span>
            </div>
          </div>

          <div class="flex flex-col gap-3 lg:w-80">
            <a
              v-if="t.preview?.demoUrl"
              :href="t.preview.demoUrl"
              target="_blank"
              rel="noopener"
              class="btn-primary justify-between"
            >
              <span>Live demo</span>
              <Icon name="lucide:external-link" class="h-4 w-4" />
            </a>
            <button class="btn-accent justify-between" @click="$copy(installSnippet)">
              <span>Copy install command</span>
              <Icon name="lucide:copy" class="h-4 w-4" />
            </button>
            <a
              v-if="t.preview?.repoUrl"
              :href="t.preview.repoUrl"
              target="_blank"
              rel="noopener"
              class="btn-outline justify-between"
            >
              <span>View repository</span>
              <Icon name="lucide:github" class="h-4 w-4" />
            </a>
            <div class="mt-1 flex items-center justify-between rounded-md border border-ink/10 bg-paper/70 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-ink/45 dark:border-paper/10 dark:bg-ink/50 dark:text-paper/45">
              <span class="flex items-center gap-1.5">
                <Icon name="lucide:cpu" class="h-3 w-3 text-blueprint-600 dark:text-blueprint-300" />
                ai-readable
              </span>
              <span class="text-ink/35 dark:text-paper/35">grayprint.ai/v1</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-[1fr_320px]">
      <article class="min-w-0">
        <section>
          <div class="flex items-center gap-2">
            <span class="h-1 w-1 rounded-full bg-blueprint-500" aria-hidden="true" />
            <div class="font-mono text-[10px] uppercase tracking-widest text-blueprint-700">
              overview
            </div>
          </div>
          <h2 class="mt-2 font-display text-3xl font-bold tracking-tight text-ink dark:text-paper">About this template</h2>
          <p class="mt-4 whitespace-pre-line text-pretty text-base leading-relaxed text-ink/80 dark:text-paper/80">
            {{ t.description }}
          </p>
        </section>

        <section class="mt-12">
          <div class="flex items-center gap-2">
            <span class="h-1 w-1 rounded-full bg-blueprint-500" aria-hidden="true" />
            <div class="font-mono text-[10px] uppercase tracking-widest text-blueprint-700">
              install
            </div>
          </div>
          <h2 class="mt-2 font-display text-3xl font-bold tracking-tight text-ink dark:text-paper">One command</h2>
          <div class="mt-4 overflow-hidden rounded-xl border border-ink/10 bg-ink">
            <div class="flex items-center gap-2 border-b border-paper/10 px-4 py-2.5">
              <span class="h-2 w-2 rounded-full bg-spark-500/80" />
              <span class="h-2 w-2 rounded-full bg-accent-400/80" />
              <span class="h-2 w-2 rounded-full bg-blueprint-400/80" />
              <span class="ml-3 font-mono text-[10px] uppercase tracking-widest text-paper/55">
                terminal
              </span>
              <button
                class="ml-auto inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-paper/55 transition hover:bg-paper/10 hover:text-paper"
                @click="$copy(installSnippet)"
              >
                <Icon name="lucide:copy" class="h-3 w-3" />
                copy
              </button>
            </div>
            <pre class="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-paper"><code><span class="text-paper/40">$ </span>{{ installSnippet }}</code></pre>
          </div>
        </section>

        <section class="mt-12">
          <AiBlock :ai="t.ai" :slug="t.slug" />
        </section>

        <section v-if="t.components?.length" class="mt-12">
          <div class="flex items-center gap-2">
            <span class="h-1 w-1 rounded-full bg-blueprint-500" aria-hidden="true" />
            <div class="font-mono text-[10px] uppercase tracking-widest text-blueprint-700">
              components
            </div>
          </div>
          <h2 class="mt-2 font-display text-3xl font-bold tracking-tight text-ink dark:text-paper">What's inside</h2>
          <ul class="mt-5 grid gap-3 sm:grid-cols-2">
            <li
              v-for="c in t.components"
              :key="c.name"
              class="rounded-lg border border-ink/10 bg-paper p-4 transition hover:border-ink/20 dark:border-paper/10 dark:bg-ink/60 dark:hover:border-paper/20"
            >
              <div class="flex items-center gap-2">
                <span class="font-mono text-[10px] uppercase tracking-widest text-blueprint-700 dark:text-blueprint-300">
                  {{ c.registry }}
                </span>
                <span class="rounded bg-ink/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-ink/55 dark:bg-paper/[0.06] dark:text-paper/55">
                  component
                </span>
              </div>
              <div class="mt-1.5 font-display text-base font-bold tracking-tight text-ink dark:text-paper">
                {{ c.name }}
              </div>
              <div v-if="c.path" class="mt-1 font-mono text-xs text-ink/50 dark:text-paper/50">{{ c.path }}</div>
            </li>
          </ul>
        </section>
      </article>

      <aside class="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div class="rounded-xl border border-ink/10 bg-paper p-5 dark:border-paper/10 dark:bg-ink/60">
          <div class="font-mono text-[10px] uppercase tracking-widest text-ink/50 dark:text-paper/50">categories</div>
          <div class="mt-2.5 flex flex-wrap gap-1.5">
            <NuxtLink
              v-for="c in t.categories"
              :key="c.slug"
              :to="`/categories/${c.slug}`"
              class="chip hover:border-ink/30"
            >
              {{ c.name }}
            </NuxtLink>
          </div>
        </div>
        <div class="rounded-xl border border-ink/10 bg-paper p-5 dark:border-paper/10 dark:bg-ink/60">
          <div class="font-mono text-[10px] uppercase tracking-widest text-ink/50 dark:text-paper/50">tags</div>
          <div class="mt-2.5 flex flex-wrap gap-1.5">
            <NuxtLink
              v-for="tag in t.tags"
              :key="tag.slug"
              :to="`/tags/${tag.slug}`"
              class="chip hover:border-ink/30"
            >
              {{ tag.name }}
            </NuxtLink>
          </div>
        </div>
        <div class="relative overflow-hidden rounded-xl border border-blueprint-200 bg-blueprint-50/40 p-5">
          <div
            class="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-accent-400/30 blur-2xl"
            aria-hidden="true"
          />
          <div class="relative">
            <div class="flex items-center gap-2">
              <span class="grid h-5 w-5 place-items-center rounded-full bg-blueprint-500 text-paper">
                <Icon name="lucide:cpu" class="h-2.5 w-2.5" />
              </span>
              <div class="font-mono text-[10px] uppercase tracking-widest text-blueprint-800">
                for agents
              </div>
            </div>
            <p class="mt-2.5 text-xs leading-relaxed text-ink/70">
              Call this template from the MCP server with
              <code class="font-mono text-blueprint-700">get_template</code>
              (slug
              <code class="rounded bg-paper px-1 font-mono text-[11px]">{{ t.slug }}</code>) or via
              the SDK.
            </p>
            <NuxtLink
              to="/docs/mcp"
              class="mt-4 inline-flex items-center gap-1 text-xs font-medium text-blueprint-700 hover:text-blueprint-900"
            >
              MCP docs <Icon name="lucide:arrow-right" class="h-3 w-3" />
            </NuxtLink>
          </div>
        </div>
      </aside>
    </div>
  </main>
</template>
