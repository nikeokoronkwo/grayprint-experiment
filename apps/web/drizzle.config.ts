import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const url = process.env.DATABASE_URL ?? 'postgresql://grayprint:grayprint@localhost:5432/grayprint';

export default defineConfig({
  schema: './server/db/schema/*',
  out: './server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
