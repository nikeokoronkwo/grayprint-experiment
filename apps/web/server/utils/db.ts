import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema/index';

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let _pool: Pool | null = null;

/**
 * Lazy singleton Drizzle client. Reads `DATABASE_URL` from runtimeConfig at first use.
 * On serverless runtimes (Vercel) a fresh pool may be created per cold start — Postgres
 * connection pooling on the provider side handles that.
 */
export function useDb() {
  if (_db) return _db;
  const config = useRuntimeConfig();
  const url = config.databaseUrl;
  if (!url) {
    throw new Error(
      '[grayprint] DATABASE_URL is not set. Add it to .env or your hosting provider.',
    );
  }
  _pool = new Pool({ connectionString: url, max: 10 });
  _db = drizzle(_pool, { schema, casing: 'snake_case' });
  return _db;
}

/** Exposed for tests / migrations that need raw pool access. */
export function usePgPool() {
  if (!_pool) useDb();
  return _pool!;
}

export { schema };
