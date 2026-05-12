<script setup lang="ts">
const props = defineProps<{ modelValue?: string; placeholder?: string }>();
const emit = defineEmits<{ 'update:modelValue': [string]; submit: [string] }>();

const local = ref(props.modelValue ?? '');
watch(() => props.modelValue, (v) => (local.value = v ?? ''));

function onInput(e: Event) {
  local.value = (e.target as HTMLInputElement).value;
  emit('update:modelValue', local.value);
}
function onSubmit(e: Event) {
  e.preventDefault();
  emit('submit', local.value);
}
</script>

<template>
  <form
    class="flex w-full items-center gap-2 rounded-pill border border-ink/15 bg-paper px-4 py-2.5 shadow-card focus-within:border-blueprint-500"
    @submit="onSubmit"
  >
    <Icon name="lucide:search" class="h-4 w-4 text-ink/40" />
    <input
      :value="local"
      type="text"
      :placeholder="placeholder ?? 'Search templates, frameworks, tags…'"
      class="w-full bg-transparent text-sm outline-hidden placeholder:text-ink/40"
      @input="onInput"
    />
    <kbd class="hidden rounded-md border border-ink/15 px-1.5 py-0.5 font-mono text-[10px] text-ink/50 sm:inline-flex">
      ⌘K
    </kbd>
  </form>
</template>
