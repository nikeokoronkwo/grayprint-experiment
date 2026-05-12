<script setup lang="ts">
import type { AiMetadata } from '@grayprint/schemas';

const props = defineProps<{ ai: AiMetadata; slug: string }>();

const serialized = computed(() => JSON.stringify({ slug: props.slug, ...props.ai }, null, 2));
</script>

<template>
  <section class="relative overflow-hidden rounded-xl border border-blueprint-200 bg-ink p-6 text-paper dark:border-blueprint-500/40">
    <div class="pointer-events-none absolute inset-0 bg-blueprint-grid opacity-[0.08]" aria-hidden="true" />
    <div class="relative">
      <div class="flex items-center gap-2">
        <span class="grid h-5 w-5 place-items-center rounded-full bg-accent-400 text-ink">
          <Icon name="lucide:cpu" class="h-3 w-3" />
        </span>
        <div class="font-mono text-[11px] uppercase tracking-widest text-paper/70">
          ai-readable · application/grayprint+json
        </div>
      </div>
      <h2 class="mt-3 font-display text-2xl font-bold tracking-tight">For agents and crawlers</h2>
      <p class="mt-2 max-w-2xl text-sm text-paper/70">
        {{ props.ai.purpose }}
      </p>

      <div class="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <div class="font-mono text-[10px] uppercase tracking-widest text-paper/60">capabilities</div>
          <ul class="mt-2 space-y-1.5 text-sm">
            <li v-for="cap in props.ai.capabilities" :key="cap" class="flex gap-2">
              <Icon name="lucide:check" class="h-4 w-4 shrink-0 text-accent-400" />
              <span class="text-paper/85">{{ cap }}</span>
            </li>
          </ul>
        </div>
        <div v-if="props.ai.compatibility">
          <div class="font-mono text-[10px] uppercase tracking-widest text-paper/60">compatibility</div>
          <dl class="mt-2 space-y-1.5 text-sm">
            <div v-if="props.ai.compatibility.frameworks?.length" class="flex gap-2">
              <dt class="text-paper/55">frameworks</dt>
              <dd class="text-paper/85">{{ props.ai.compatibility.frameworks.join(', ') }}</dd>
            </div>
            <div v-if="props.ai.compatibility.runtimes?.length" class="flex gap-2">
              <dt class="text-paper/55">runtimes</dt>
              <dd class="text-paper/85">{{ props.ai.compatibility.runtimes.join(', ') }}</dd>
            </div>
            <div v-if="props.ai.compatibility.package_managers?.length" class="flex gap-2">
              <dt class="text-paper/55">package managers</dt>
              <dd class="text-paper/85">{{ props.ai.compatibility.package_managers.join(', ') }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div v-if="props.ai.installHint" class="mt-6">
        <div class="font-mono text-[10px] uppercase tracking-widest text-paper/60">install hint</div>
        <pre
          class="mt-2 overflow-x-auto rounded-md border border-paper/10 bg-black/40 p-3 text-xs leading-relaxed text-accent-200"
        ><code>{{ props.ai.installHint }}</code></pre>
      </div>

      <details class="mt-6 group">
        <summary class="cursor-pointer font-mono text-[10px] uppercase tracking-widest text-paper/60 hover:text-paper">
          inspect raw json
        </summary>
        <pre
          class="mt-2 max-h-96 overflow-auto rounded-md border border-paper/10 bg-black/40 p-3 text-[11px] leading-relaxed text-paper/85"
        ><code>{{ serialized }}</code></pre>
      </details>
    </div>
  </section>
</template>
