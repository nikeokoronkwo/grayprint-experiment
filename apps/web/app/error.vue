<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{ error: NuxtError }>();
const message = computed(() => props.error?.statusMessage || 'Something went wrong');
const status = computed(() => props.error?.statusCode ?? 500);
const stack = computed(() => props.error?.stack ?? '');

function home() {
  clearError({ redirect: '/' });
}
</script>

<template>
  <div class="bp-grid-paper flex min-h-screen items-center justify-center px-6 py-16">
    <div class="w-full max-w-lg text-center">
      <div class="font-mono text-sm uppercase tracking-widest text-blueprint-600">
        error · {{ status }}
      </div>
      <h1 class="mt-3 font-display text-5xl font-bold tracking-tight text-ink">
        {{ message }}
      </h1>
      <p class="mt-4 text-pretty text-ink/70">
        The blueprint says this page shouldn't be here. Head back to the marketplace.
      </p>
      <div class="mt-8 flex justify-center gap-3">
        <button class="btn-primary" @click="home">Take me home</button>
        <NuxtLink to="/templates" class="btn-outline">Browse templates</NuxtLink>
      </div>

      <DevOnly>
        <details
          v-if="stack"
          class="mt-10 rounded-lg border border-ink/10 bg-ink/[0.02] p-4 text-left"
        >
          <summary class="cursor-pointer select-none font-mono text-[10px] uppercase tracking-widest text-ink/55">
            dev details — visible only in dev mode
          </summary>
          <pre class="mt-3 overflow-x-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-ink/70"
            v-html="stack" />
        </details>
      </DevOnly>
    </div>
  </div>
</template>
