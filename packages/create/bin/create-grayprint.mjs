#!/usr/bin/env node
import('../dist/create.js').catch(async () => {
  const { tsImport } = await import('tsx/esm/api');
  await tsImport('../src/create.ts', import.meta.url);
});
