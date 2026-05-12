<script setup lang="ts">
import type { PublicTemplate } from '@grayprint/schemas';

const route = useRoute();
const slug = route.params.slug as string;

const { data, error } = await useAsyncData(`tpl:${slug}`, () =>
  $fetch<PublicTemplate>(`/api/templates/${slug}`),
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
    <div class="bp-grid-paper border-b border-ink/10">
      <div class="mx-auto max-w-6xl px-6 py-12">
        <div class="flex items-center gap-2 text-xs text-ink/55">
          <NuxtLink to="/templates" class="hover:text-blueprint-700">Templates</NuxtLink>
          <Icon name="lucide:chevron-right" class="h-3 w-3" />
          <NuxtLink
            v-if="t.categories[0]"
            :to="`/categories/${t.categories[0].slug}`"
            class="hover:text-blueprint-700"
          >
            {{ t.categories[0].name }}
          </NuxtLink>
          <Icon v-if="t.categories[0]" name="lucide:chevron-right" class="h-3 w-3" />
          <span class="text-ink/70">{{ t.title }}</span>
        </div>

        <div class="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div class="max-w-2xl">
            <div class="flex flex-wrap gap-2">
              <span class="chip">{{ t.kind }}</span>
              <span class="chip">{{ t.framework }}</span>
              <span class="chip">{{ t.license }}</span>
              <span
                class="chip"
                :class="t.pricing === 'free' ? 'border-accent-400 bg-accent-100 text-ink' : ''"
              >
                {{ t.pricing }}
              </span>
            </div>
            <h1 class="mt-4 font-display text-5xl font-bold leading-[1.05] tracking-tight">
              {{ t.title }}
            </h1>
            <p class="mt-4 text-pretty text-lg text-ink/70">{{ t.summary }}</p>
            <div class="mt-6 flex items-center gap-3 text-sm text-ink/60">
              <div class="grid h-7 w-7 place-items-center rounded-full bg-ink text-paper">
                <span class="font-mono text-[11px] font-bold">
                  {{ (t.author.handle ?? '?').slice(0, 1).toUpperCase() }}
                </span>
              </div>
              <span>by {{ t.author.name ?? t.author.handle }}</span>
              <span class="text-ink/30">·</span>
              <span>v{{ t.version }}</span>
              <span v-if="t.publishedAt" class="text-ink/30">·</span>
              <span v-if="t.publishedAt">{{ new Date(t.publishedAt).toLocaleDateString() }}</span>
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
              <span>Use this template</span>
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
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-[1fr_320px]">
      <article class="min-w-0">
        <section>
          <h2 class="font-display text-2xl font-bold tracking-tight">About this template</h2>
          <p class="mt-3 whitespace-pre-line text-pretty text-ink/80">{{ t.description }}</p>
        </section>

        <section class="mt-10">
          <h2 class="font-display text-2xl font-bold tracking-tight">Install</h2>
          <pre
            class="mt-3 overflow-x-auto rounded-md border border-ink/10 bg-ink p-4 font-mono text-sm leading-relaxed text-paper"
          ><code>{{ installSnippet }}</code></pre>
        </section>

        <section class="mt-10">
          <AiBlock :ai="t.ai" :slug="t.slug" />
        </section>

        <section v-if="t.components?.length" class="mt-10">
          <h2 class="font-display text-2xl font-bold tracking-tight">Components</h2>
          <ul class="mt-3 grid gap-2 sm:grid-cols-2">
            <li
              v-for="c in t.components"
              :key="c.name"
              class="rounded-md border border-ink/10 bg-paper p-3 text-sm"
            >
              <div class="font-mono text-xs text-blueprint-700">{{ c.registry }}</div>
              <div class="mt-0.5 font-medium">{{ c.name }}</div>
            </li>
          </ul>
        </section>
      </article>

      <aside class="space-y-6">
        <div class="rounded-xl border border-ink/10 bg-paper p-5">
          <div class="font-mono text-[10px] uppercase tracking-widest text-ink/50">categories</div>
          <div class="mt-2 flex flex-wrap gap-1.5">
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
        <div class="rounded-xl border border-ink/10 bg-paper p-5">
          <div class="font-mono text-[10px] uppercase tracking-widest text-ink/50">tags</div>
          <div class="mt-2 flex flex-wrap gap-1.5">
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
        <div class="rounded-xl border border-blueprint-200 bg-blueprint-50/40 p-5">
          <div class="flex items-center gap-2">
            <Icon name="lucide:cpu" class="h-4 w-4 text-blueprint-700" />
            <div class="font-mono text-[10px] uppercase tracking-widest text-blueprint-800">
              for agents
            </div>
          </div>
          <p class="mt-2 text-xs text-ink/70">
            Call this template from the MCP server with
            <code class="font-mono text-blueprint-700">get_template</code>
            (slug: <code class="font-mono">{{ t.slug }}</code>) or via the SDK.
          </p>
          <NuxtLink to="/docs/mcp" class="mt-3 inline-flex text-xs font-medium text-blueprint-700">
            MCP docs →
          </NuxtLink>
        </div>
      </aside>
    </div>
  </main>
</template>
