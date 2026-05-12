<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: ['auth'] });
useSeoMeta({ title: 'Agents', description: 'API keys for AI agents and the MCP server.' });

type ApiKeyRow = {
  id: string;
  name: string;
  start: string;
  createdAt: string;
  lastRequest: string | null;
  expiresAt: string | null;
  enabled: boolean;
};

const { data, refresh, pending } = useAsyncData('agents:list', () =>
  $fetch<ApiKeyRow[]>('/api/agents').catch(() => []),
);

const showCreate = ref(false);
const name = ref('');
const issued = ref<{ key: string; row: ApiKeyRow } | null>(null);
const creating = ref(false);

async function create() {
  creating.value = true;
  try {
    const res = await $fetch<ApiKeyRow & { key: string }>('/api/agents', {
      method: 'POST',
      body: { name: name.value },
    });
    issued.value = { key: res.key, row: res };
    name.value = '';
    showCreate.value = false;
    await refresh();
  } finally {
    creating.value = false;
  }
}

async function revoke(id: string) {
  if (!confirm('Revoke this API key? Any agent using it will lose access.')) return;
  await $fetch(`/api/agents/${id}`, { method: 'DELETE' });
  await refresh();
}
</script>

<template>
  <div>
    <header class="mb-8 flex items-end justify-between">
      <div>
        <div class="font-mono text-[10px] uppercase tracking-widest text-blueprint-700">agents</div>
        <h1 class="mt-1 font-display text-3xl font-bold tracking-tight">Agent API keys</h1>
        <p class="mt-1 text-sm text-ink/65">
          Keys identify AI agents calling the Grayprint registry or MCP server.
        </p>
      </div>
      <button class="btn-primary" @click="showCreate = true">
        <Icon name="lucide:plus" class="h-4 w-4" /> New key
      </button>
    </header>

    <div v-if="issued" class="mb-6 rounded-xl border border-accent-400 bg-accent-50 p-5">
      <div class="font-mono text-[10px] uppercase tracking-widest text-accent-900">copy this — shown once</div>
      <pre class="mt-2 overflow-x-auto rounded-md border border-ink/15 bg-paper p-3 font-mono text-xs">{{ issued.key }}</pre>
      <button class="btn-ghost mt-3 text-sm" @click="issued = null">Got it</button>
    </div>

    <div v-if="showCreate" class="mb-6 rounded-xl border border-ink/10 bg-paper p-5">
      <form class="flex flex-wrap items-end gap-3" @submit.prevent="create">
        <label class="block flex-1">
          <span class="font-mono text-[10px] uppercase tracking-widest text-ink/55">name</span>
          <input
            v-model="name"
            required
            placeholder="e.g. claude-desktop"
            class="mt-1 w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-sm outline-none focus:border-blueprint-500"
          />
        </label>
        <button class="btn-primary" :disabled="creating">{{ creating ? '…' : 'Create' }}</button>
        <button type="button" class="btn-ghost text-sm" @click="showCreate = false">Cancel</button>
      </form>
    </div>

    <div class="overflow-hidden rounded-xl border border-ink/10 bg-paper">
      <table class="w-full text-sm">
        <thead class="bg-paper/60 text-left text-xs text-ink/55">
          <tr>
            <th class="px-4 py-3 font-mono uppercase tracking-widest">name</th>
            <th class="px-4 py-3 font-mono uppercase tracking-widest">key</th>
            <th class="px-4 py-3 font-mono uppercase tracking-widest">last used</th>
            <th class="px-4 py-3 font-mono uppercase tracking-widest">expires</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pending">
            <td colspan="5" class="px-4 py-6 text-center text-ink/50">Loading…</td>
          </tr>
          <tr v-else-if="!data || data.length === 0">
            <td colspan="5" class="px-4 py-12 text-center">
              <EmptyState
                icon="lucide:bot"
                title="No agent keys yet"
                description="Create your first key to let an agent or MCP client identify itself."
              />
            </td>
          </tr>
          <tr v-for="row in data" :key="row.id" class="border-t border-ink/10">
            <td class="px-4 py-3 font-medium">{{ row.name }}</td>
            <td class="px-4 py-3 font-mono text-xs text-ink/60">{{ row.start ?? '••••' }}…</td>
            <td class="px-4 py-3 text-ink/60">
              {{ row.lastRequest ? new Date(row.lastRequest).toLocaleString() : '—' }}
            </td>
            <td class="px-4 py-3 text-ink/60">
              {{ row.expiresAt ? new Date(row.expiresAt).toLocaleDateString() : 'never' }}
            </td>
            <td class="px-4 py-3 text-right">
              <button class="text-xs text-spark-600 hover:underline" @click="revoke(row.id)">Revoke</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
