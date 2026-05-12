import { randomBytes } from 'node:crypto';

/** URL-safe, sortable-ish id. 24 chars, no hyphens, lowercase alnum. */
export function newId(prefix?: string) {
  const buf = randomBytes(15).toString('base64url').toLowerCase().replace(/[^a-z0-9]/g, '');
  const id = (Date.now().toString(36) + buf).slice(0, 24);
  return prefix ? `${prefix}_${id}` : id;
}
