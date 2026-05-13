/**
 * Signs the current user out via the better-auth client SDK.
 * The client handles CSRF + credentials; do not call `/api/auth/sign-out` directly.
 * Returns once the server has cleared the session cookie.
 */
export function useSignOut() {
  const client = useAuthClient() as unknown as {
    signOut: (opts?: {
      fetchOptions?: {
        onSuccess?: () => void;
        onError?: (ctx: { error: { message?: string } }) => void;
      };
    }) => Promise<unknown>;
  };

  return async function signOut(redirectTo: string = '/') {
    await client.signOut();
    await navigateTo(redirectTo, { replace: true });
  };
}
