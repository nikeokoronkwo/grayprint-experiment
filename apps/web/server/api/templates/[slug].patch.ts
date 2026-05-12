import { and, eq } from 'drizzle-orm';
import { templateUpdateInput } from '@grayprint/schemas';
import { useDb } from '~~/server/utils/db';
import { template, templateCategory, templateTag } from '~~/server/db/schema/registry';
import { principalHasScope, requirePrincipal } from '~~/server/utils/principals';
import { hydrateTemplate } from '~~/server/utils/projections';

export default defineEventHandler(async (event) => {
  const principal = await requirePrincipal(event);
  if (!principalHasScope(principal, 'registry:write')) {
    throw createError({ statusCode: 403, statusMessage: 'registry:write scope required' });
  }
  const slug = getRouterParam(event, 'slug');
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'slug required' });

  const body = await readBody(event);
  const parsed = templateUpdateInput.safeParse(body);
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.message });
  }
  const input = parsed.data;
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

  const now = new Date();
  await db.transaction(async (tx) => {
    const patch: Record<string, unknown> = { updatedAt: now };
    for (const k of [
      'title',
      'summary',
      'description',
      'kind',
      'framework',
      'license',
      'version',
      'visibility',
      'pricing',
      'priceCents',
      'preview',
      'install',
      'components',
      'dependencies',
      'ai',
    ] as const) {
      if (input[k] !== undefined) patch[k] = input[k];
    }
    await tx.update(template).set(patch).where(eq(template.id, existing.id));

    if (input.categoryIds) {
      await tx.delete(templateCategory).where(eq(templateCategory.templateId, existing.id));
      if (input.categoryIds.length) {
        await tx
          .insert(templateCategory)
          .values(input.categoryIds.map((cid) => ({ templateId: existing.id, categoryId: cid })));
      }
    }
    if (input.tagIds) {
      await tx.delete(templateTag).where(eq(templateTag.templateId, existing.id));
      if (input.tagIds.length) {
        await tx
          .insert(templateTag)
          .values(input.tagIds.map((tid) => ({ templateId: existing.id, tagId: tid })));
      }
    }
  });

  return await hydrateTemplate(existing.id);
});
