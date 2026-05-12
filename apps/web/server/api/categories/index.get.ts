import { asc } from 'drizzle-orm';
import { useDb } from '~~/server/utils/db';
import { category } from '~~/server/db/schema/registry';

export default defineEventHandler(async () => {
  const db = useDb();
  const rows = await db.select().from(category).orderBy(asc(category.order), asc(category.name));
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description,
    icon: r.icon,
    parentId: r.parentId,
    order: r.order,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));
});
