import { and, eq } from 'drizzle-orm';
import { useDb } from '~~/server/utils/db';
import { template } from '~~/server/db/schema/registry';
import { hydrateTemplate } from '~~/server/utils/projections';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'slug required' });
  const db = useDb();

  const [row] = await db
    .select({ id: template.id })
    .from(template)
    .where(
      and(
        eq(template.slug, slug),
        eq(template.status, 'published'),
        eq(template.visibility, 'public'),
      ),
    )
    .limit(1);

  if (!row) throw createError({ statusCode: 404, statusMessage: 'template not found' });
  const hydrated = await hydrateTemplate(row.id);
  if (!hydrated) throw createError({ statusCode: 404, statusMessage: 'template not found' });
  return hydrated;
});
