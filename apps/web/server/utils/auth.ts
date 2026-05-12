import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import {
  apiKey,
  deviceAuthorization,
  emailOTP,
  magicLink,
  mcp,
} from 'better-auth/plugins';
import { checkout, polar, portal, webhooks } from '@polar-sh/better-auth';
import { Polar } from '@polar-sh/sdk';
import { sendDeviceApprovalEmail, sendMagicLinkEmail, sendOtpEmail } from './email.js';
import { recordPolarEvent } from './polar-events.js';
import { useDb } from './db.js';

/**
 * Singleton better-auth instance. We construct lazily so runtimeConfig is available.
 */
let _auth: ReturnType<typeof betterAuth> | null = null;

export function useAuth() {
  if (_auth) return _auth;
  const config = useRuntimeConfig();
  const db = useDb();

  const polarClient = config.polarAccessToken
    ? new Polar({
        accessToken: config.polarAccessToken,
        server: config.polarEnvironment === 'production' ? 'production' : 'sandbox',
      })
    : null;

  const polarPlugins = polarClient
    ? [
        polar({
          client: polarClient,
          createCustomerOnSignUp: true,
          use: [
            checkout({
              products: config.polarProductProId
                ? [{ productId: config.polarProductProId, slug: 'pro' }]
                : [],
              successUrl: config.polarSuccessUrl,
              authenticatedUsersOnly: true,
            }),
            portal(),
            webhooks({
              secret: config.polarWebhookSecret,
              onPayload: async (payload) => {
                await recordPolarEvent(payload);
              },
            }),
          ],
        }),
      ]
    : [];

  _auth = betterAuth({
    appName: 'Grayprint',
    secret: config.betterAuthSecret,
    baseURL: config.betterAuthUrl || config.public.siteUrl,
    database: drizzleAdapter(db, { provider: 'pg' }),
    emailAndPassword: { enabled: false },
    user: {
      additionalFields: {
        handle: { type: 'string', required: false },
        bio: { type: 'string', required: false },
        website: { type: 'string', required: false },
        role: { type: 'string', required: false, defaultValue: 'user' },
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
      updateAge: 60 * 60 * 24, // refresh once per day
      cookieCache: { enabled: true, maxAge: 60 * 5 },
    },
    plugins: [
      magicLink({
        expiresIn: 60 * 15,
        async sendMagicLink({ email, url, token }) {
          await sendMagicLinkEmail({ email, url, token });
        },
      }),
      emailOTP({
        otpLength: 6,
        expiresIn: 60 * 10,
        async sendVerificationOTP({ email, otp, type }) {
          await sendOtpEmail({ email, otp, type });
        },
      }),
      deviceAuthorization({
        expiresIn: '15m',
        interval: '5s',
        async sendDeviceCodeApproval({ email, userCode, verificationUri }) {
          await sendDeviceApprovalEmail({ email, userCode, verificationUri });
        },
      }),
      apiKey({
        defaultPrefix: 'gp_',
        rateLimit: { enabled: true, timeWindow: 60_000, maxRequests: 240 },
        permissions: {
          defaultPermissions: { registry: ['read'], mcp: ['call'] },
        },
      }),
      mcp({
        loginPage: '/login',
      }),
      ...polarPlugins,
    ],
    advanced: {
      defaultCookieAttributes: {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  });

  return _auth;
}

/** Helper used by every server route that needs the current user/session. */
export async function getSession(event: ReturnType<typeof useEvent>) {
  const auth = useAuth();
  return await auth.api.getSession({ headers: event.headers });
}

/** Resolves the requesting principal — a user session OR a valid agent API key. */
export async function getPrincipal(event: ReturnType<typeof useEvent>) {
  const auth = useAuth();
  const session = await auth.api.getSession({ headers: event.headers });
  if (session?.user) {
    return { kind: 'user' as const, userId: session.user.id, session };
  }
  const bearer = event.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (bearer) {
    // better-auth apiKey plugin exposes a verifier
    try {
      const verified = await auth.api.verifyApiKey({ body: { key: bearer } });
      if (verified?.valid && verified.key?.userId) {
        return {
          kind: 'apiKey' as const,
          userId: verified.key.userId,
          keyId: verified.key.id,
          permissions: verified.key.permissions,
        };
      }
    } catch {
      // fall through
    }
  }
  return null;
}

export type Principal = NonNullable<Awaited<ReturnType<typeof getPrincipal>>>;
