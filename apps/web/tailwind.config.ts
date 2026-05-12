import type { Config } from 'tailwindcss';
import grayprint from '@grayprint/ui/tailwind-preset';

export default {
  presets: [grayprint as Config],
  darkMode: 'class',
  content: [
    './components/**/*.{vue,ts}',
    './layouts/**/*.{vue,ts}',
    './pages/**/*.{vue,ts}',
    './app.vue',
    './error.vue',
    './composables/**/*.ts',
    './utils/**/*.ts',
    '../../packages/ui/src/**/*.ts',
  ],
} satisfies Config;
