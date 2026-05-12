<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** Just the mark, no wordmark. */
    mark?: boolean;
    /** Tailwind size for the mark. */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** Render in light-on-dark (for use on inverted surfaces). */
    inverted?: boolean;
  }>(),
  { mark: false, size: 'md', inverted: false },
);

const sizeMap = {
  sm: { mark: 'h-6 w-6', text: 'text-sm', g: 'text-[11px]', dot: 'h-2 w-2' },
  md: { mark: 'h-7 w-7', text: 'text-base', g: 'text-xs', dot: 'h-2.5 w-2.5' },
  lg: { mark: 'h-9 w-9', text: 'text-lg', g: 'text-sm', dot: 'h-3 w-3' },
  xl: { mark: 'h-12 w-12', text: 'text-xl', g: 'text-base', dot: 'h-3.5 w-3.5' },
} as const;
const s = sizeMap[props.size];
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-2 font-display font-bold tracking-tight',
      inverted ? 'text-paper' : 'text-ink',
    ]"
  >
    <span
      :class="[
        'relative grid place-items-center overflow-hidden rounded-lg shrink-0',
        s.mark,
        inverted ? 'bg-paper text-ink' : 'bg-ink text-paper',
      ]"
      aria-hidden="true"
    >
      <span
        class="absolute inset-0 opacity-25"
        :style="{
          backgroundImage: `linear-gradient(to right, ${inverted ? 'rgba(10,19,48,.18)' : 'rgba(59,130,246,.4)'} 1px, transparent 1px), linear-gradient(to bottom, ${inverted ? 'rgba(10,19,48,.18)' : 'rgba(59,130,246,.4)'} 1px, transparent 1px)`,
          backgroundSize: '6px 6px',
        }"
      />
      <span :class="['relative font-display font-extrabold', s.g]">g</span>
      <span
        :class="[
          'absolute -bottom-1 -right-1 rounded-full bg-accent-400 shadow-[0_0_10px_rgba(163,230,53,0.7)]',
          s.dot,
        ]"
      />
    </span>
    <span v-if="!mark" :class="['leading-none', s.text]">grayprint</span>
  </span>
</template>
