/**
 * Tiny client plugin: $copy(text) — writes to clipboard, fires a transient toast via
 * console for dev (no real toast lib at Level 0).
 */
export default defineNuxtPlugin(() => {
  return {
    provide: {
      copy: async (text: string) => {
        try {
          await navigator.clipboard.writeText(text);
          // Replace with proper toast in a follow-up
          // eslint-disable-next-line no-console
          console.info('[copied]', text);
        } catch (err) {
          console.error('[copy failed]', err);
        }
      },
    },
  };
});
