import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { create: 'src/create.ts' },
  format: ['esm'],
  target: 'node20',
  clean: true,
  splitting: false,
  dts: false,
  shims: false,
  banner: { js: '#!/usr/bin/env node' },
});
