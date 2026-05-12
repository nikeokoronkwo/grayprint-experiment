/**
 * Grayprint design tokens. Single source of truth — Tailwind preset reads these,
 * Vue components reference them, and the logo SVG mirrors them. Mutating one place
 * propagates everywhere.
 */

export const colors = {
  // The blueprint base
  ink: '#0A1330', // deep blueprint navy
  graphite: '#1F2937',
  ash: '#9CA3AF',
  paper: '#F5F2E8', // warm paper for prose
  white: '#FFFFFF',

  // The blueprint line
  blueprint: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // primary blueprint cyan
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // The zing — electric lime
  accent: {
    50: '#F7FEE7',
    100: '#ECFCCB',
    200: '#D9F99D',
    300: '#BEF264',
    400: '#A3E635', // primary accent
    500: '#84CC16',
    600: '#65A30D',
    700: '#4D7C0F',
    800: '#3F6212',
    900: '#365314',
  },

  // The secondary zing — hot magenta, used sparingly
  spark: {
    50: '#FDF2F8',
    100: '#FCE7F3',
    200: '#FBCFE8',
    300: '#F9A8D4',
    400: '#F472B6',
    500: '#EC4899',
    600: '#DB2777',
    700: '#BE185D',
  },
} as const;

export const fonts = {
  sans: '"Inter Variable", "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif',
  display:
    '"Söhne", "Inter Variable", ui-sans-serif, system-ui, -apple-system, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace',
} as const;

export const radii = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '18px',
  '2xl': '24px',
  pill: '999px',
} as const;

export const shadows = {
  /** Subtle floor-shadow, blueprint-tinted */
  card: '0 1px 0 rgba(10, 19, 48, 0.04), 0 8px 24px -8px rgba(10, 19, 48, 0.12)',
  /** Pop-out hover */
  pop: '0 2px 0 rgba(10, 19, 48, 0.06), 0 24px 48px -16px rgba(10, 19, 48, 0.22)',
  /** Accent glow used on the zing */
  glow: '0 0 0 1px rgba(163, 230, 53, 0.4), 0 12px 32px -8px rgba(163, 230, 53, 0.45)',
} as const;

export const motion = {
  ease: {
    standard: 'cubic-bezier(0.32, 0.72, 0, 1)',
    emphatic: 'cubic-bezier(0.16, 1, 0.3, 1)',
    snappy: 'cubic-bezier(0.2, 0, 0, 1)',
  },
  duration: {
    fast: '160ms',
    base: '240ms',
    slow: '440ms',
    grand: '760ms',
  },
} as const;

export const grid = {
  /** The blueprint grid line — 32px graph paper */
  size: 32,
  lineColor: 'rgba(59, 130, 246, 0.10)',
  axisColor: 'rgba(59, 130, 246, 0.18)',
} as const;

export const brand = {
  name: 'Grayprint',
  tagline: 'The blueprint for templates.',
  description:
    'A dynamic template marketplace where templates are content — discoverable, AI-readable, and built for both humans and agents.',
} as const;
