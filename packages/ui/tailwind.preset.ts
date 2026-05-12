import type { Config } from 'tailwindcss';
import { colors, fonts, motion, radii, shadows } from './src/tokens.js';

/**
 * Grayprint Tailwind preset. Consumers extend their own config from this.
 *
 * ```ts
 * import grayprint from '@grayprint/ui/tailwind-preset';
 * export default { presets: [grayprint], content: [...] } satisfies Config;
 * ```
 */
const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        ink: colors.ink,
        graphite: colors.graphite,
        ash: colors.ash,
        paper: colors.paper,
        blueprint: colors.blueprint,
        accent: colors.accent,
        spark: colors.spark,
      },
      fontFamily: {
        sans: [fonts.sans],
        display: [fonts.display],
        mono: [fonts.mono],
      },
      borderRadius: {
        ...radii,
      },
      boxShadow: {
        card: shadows.card,
        pop: shadows.pop,
        glow: shadows.glow,
      },
      transitionTimingFunction: {
        standard: motion.ease.standard,
        emphatic: motion.ease.emphatic,
        snappy: motion.ease.snappy,
      },
      transitionDuration: {
        fast: motion.duration.fast,
        base: motion.duration.base,
        slow: motion.duration.slow,
        grand: motion.duration.grand,
      },
      backgroundImage: {
        'blueprint-grid':
          'linear-gradient(to right, rgba(59,130,246,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,0.10) 1px, transparent 1px)',
        'blueprint-grid-dense':
          'linear-gradient(to right, rgba(59,130,246,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,0.18) 1px, transparent 1px)',
        'accent-zing':
          'radial-gradient(60% 60% at 50% 50%, rgba(163,230,53,0.45) 0%, rgba(163,230,53,0) 70%)',
      },
      backgroundSize: {
        grid: '32px 32px',
        'grid-dense': '8px 8px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        'grid-drift': 'grid-drift 18s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        'grid-drift': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '32px 32px' },
        },
      },
    },
  },
};

export default preset;
