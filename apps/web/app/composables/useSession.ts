export function useSession() {
  const client = useAuthClient();
  // better-auth/vue exposes useSession as a reactive composable on the client.
  // It returns { data, isPending, error, refetch }.
  return client.useSession();
}
