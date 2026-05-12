#!/usr/bin/env node
import('../dist/cli.js').catch(async () => {
  // Dev fallback — run TS source directly when dist isn't built.
  await import('tsx/esm/api');
  const { tsImport } = await import('tsx/esm/api');
  await tsImport('../src/cli.ts', import.meta.url);
});
