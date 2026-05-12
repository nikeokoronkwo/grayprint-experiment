/** Convenience accessor over the better-auth Vue client provided by the auth plugin. */
export function useAuthClient() {
  const { $authClient } = useNuxtApp();
  return $authClient as ReturnType<typeof import('better-auth/vue').createAuthClient>;
}
