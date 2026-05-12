import { eq } from 'drizzle-orm';
import { useDb } from '~/server/utils/db';
import { template } from '~/server/db/schema/registry';
import { principalHasScope, requirePrincipal } from '~/server/utils/principals';

export default defineEventHandler(async (event) => {
  const principal = await requirePrincipal(event);
  if (!principalHasScope(principal, 'registry:write')) {
    throw createError({ statusCode: 403, statusMessage: 'registry:write scope required' });
  }
  const slug = getRouterParam(event, 'slug');
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'slug required' });

  const db = useDb();
  const [existing] = await db
    .select({ id: template.id, authorId: template.authorId })
    .from(template)
    .where(eq(template.slug, slug))
    .limit(1);
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'template not found' });
  if (existing.authorId !== principal.userId) {
    throw createError({ statusCode: 403, statusMessage: 'not your template' });
  }

  await db.delete(template).where(eq(template.id, existing.id));
  return { ok: true };
});
