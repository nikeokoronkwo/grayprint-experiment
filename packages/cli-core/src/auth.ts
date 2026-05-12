import pc from 'picocolors';
import { GrayprintClient } from '@grayprint/sdk';
import { setActiveAccount, type StoredAccount } from './config.js';

type DeviceCodeResponse = {
  device_code: string;
  user_code: string;
  verification_uri: string;
  verification_uri_complete?: string;
  expires_in: number;
  interval: number;
};

type DeviceTokenSuccess = {
  access_token: string;
  token_type: string;
  user?: { id: string; email: string; name?: string | null; handle?: string | null };
};

type DeviceTokenError = { error: string; error_description?: string };

export interface DeviceAuthResult {
  account: StoredAccount;
  host: string;
}

/**
 * Run the RFC 8628 device authorization flow against the better-auth deviceAuthorization plugin.
 *
 * Two endpoints (better-auth defaults):
 *   POST /api/auth/device/code  → { device_code, user_code, verification_uri, expires_in, interval }
 *   POST /api/auth/device/token → { access_token } | { error: 'authorization_pending' | 'slow_down' | … }
 */
export async function deviceAuthLogin(opts: {
  apiUrl: string;
  onCode: (info: { userCode: string; verificationUri: string }) => void;
}): Promise<DeviceAuthResult> {
  const base = opts.apiUrl.replace(/\/$/, '');
  const codeRes = await fetch(`${base}/api/auth/device/code`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ client_id: 'grayprint-cli' }),
  });
  if (!codeRes.ok) throw new Error(`device/code failed: ${codeRes.status}`);
  const code = (await codeRes.json()) as DeviceCodeResponse;

  opts.onCode({
    userCode: code.user_code,
    verificationUri: code.verification_uri_complete ?? code.verification_uri,
  });

  const start = Date.now();
  let interval = Math.max(1, code.interval ?? 5);
  while (Date.now() - start < code.expires_in * 1000) {
    await new Promise((r) => setTimeout(r, interval * 1000));
    const tokenRes = await fetch(`${base}/api/auth/device/token`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        device_code: code.device_code,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        client_id: 'grayprint-cli',
      }),
    });
    if (tokenRes.ok) {
      const body = (await tokenRes.json()) as DeviceTokenSuccess;
      const account: StoredAccount = {
        userId: body.user?.id ?? 'unknown',
        email: body.user?.email ?? '',
        handle: body.user?.handle ?? undefined,
        token: body.access_token,
        createdAt: new Date().toISOString(),
      };
      setActiveAccount(base, account);
      return { account, host: base };
    }
    const err = (await tokenRes.json().catch(() => ({ error: 'unknown' }))) as DeviceTokenError;
    if (err.error === 'slow_down') interval = Math.min(30, interval + 5);
    else if (err.error !== 'authorization_pending') {
      throw new Error(`${pc.red('device auth failed:')} ${err.error_description ?? err.error}`);
    }
  }
  throw new Error('device code expired before approval');
}

/** Construct an SDK client for the active account, or anonymous if none. */
export function clientFromActiveAccount(opts?: { apiUrl?: string; token?: string }) {
  return new GrayprintClient({
    apiUrl: opts?.apiUrl,
    token: opts?.token,
  });
}
