import { createAuthClient } from 'better-auth/vue';
import {
  apiKeyClient,
  deviceAuthorizationClient,
  emailOTPClient,
  magicLinkClient,
} from 'better-auth/client/plugins';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const authClient = createAuthClient({
    baseURL: config.public.siteUrl,
    plugins: [
      magicLinkClient(),
      emailOTPClient(),
      deviceAuthorizationClient(),
      apiKeyClient(),
    ],
  });
  return {
    provide: {
      authClient,
    },
  };
});
