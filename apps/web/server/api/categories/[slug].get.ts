import { eq } from 'drizzle-orm';
import { useDb } from '~/server/utils/db';
import { category } from '~/server/db/schema/registry';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'slug required' });
  const db = useDb();
  const [row] = await db.select().from(category).where(eq(category.slug, slug)).limit(1);
  if (!row) throw createError({ statusCode: 404, statusMessage: 'category not found' });
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    icon: row.icon,
    parentId: row.parentId,
    order: row.order,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
});
