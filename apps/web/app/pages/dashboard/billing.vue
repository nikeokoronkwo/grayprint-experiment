<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: ['auth'] });
useSeoMeta({ title: 'Billing', description: 'Polar-managed subscriptions and orders.' });

const config = useRuntimeConfig();
const polarConfigured = computed(() => config.public.polarEnvironment !== undefined);
</script>

<template>
  <div>
    <header class="mb-8">
      <div class="font-mono text-[10px] uppercase tracking-widest text-blueprint-700">billing</div>
      <h1 class="mt-1 font-display text-3xl font-bold tracking-tight">Billing</h1>
      <p class="mt-1 text-sm text-ink/65">
        Subscriptions and orders are managed by
        <a href="https://polar.sh" target="_blank" class="underline">Polar</a>,
        our Merchant of Record.
      </p>
    </header>

    <div class="rounded-xl border border-ink/10 bg-paper p-6">
      <div class="font-display text-xl font-bold tracking-tight">Manage in Polar</div>
      <p class="mt-2 text-sm text-ink/65">
        Open your customer portal to update payment methods, download invoices, or change plans.
      </p>
      <div class="mt-5 flex gap-3">
        <a href="/api/auth/polar/portal" class="btn-primary">
          Open customer portal <Icon name="lucide:external-link" class="h-4 w-4" />
        </a>
        <a href="/api/auth/polar/checkout/pro" class="btn-outline">
          Upgrade to Pro
        </a>
      </div>
      <p v-if="!polarConfigured" class="mt-4 text-xs text-spark-700">
        Polar isn't fully configured yet. Set <code class="font-mono">POLAR_ACCESS_TOKEN</code> and
        <code class="font-mono">POLAR_PRODUCT_PRO_ID</code> to enable these flows.
      </p>
    </div>

    <div class="mt-6 rounded-xl border border-dashed border-ink/15 p-6 text-sm text-ink/60">
      <div class="font-display text-base font-bold text-ink/80">About entitlements</div>
      <p class="mt-1">
        Level 0 leaves entitlements wired but unexposed. Once Level 1 ships, paid templates and
        private registries will be gated by the entitlement layer fed from Polar webhooks.
      </p>
    </div>
  </div>
</template>
