#!/usr/bin/env node
import('../dist/stdio.js').catch(async () => {
  const { tsImport } = await import('tsx/esm/api');
  await tsImport('../src/stdio.ts', import.meta.url);
});
