import { asc } from 'drizzle-orm';
import { useDb } from '~~/server/utils/db';
import { tag } from '~~/server/db/schema/registry';

export default defineEventHandler(async () => {
  const db = useDb();
  const rows = await db.select().from(tag).orderBy(asc(tag.name));
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    createdAt: r.createdAt.toISOString(),
  }));
});
