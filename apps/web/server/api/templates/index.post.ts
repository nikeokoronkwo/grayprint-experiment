import { templateCreateInput } from '@grayprint/schemas';
import { useDb } from '~~/server/utils/db';
import { template, templateCategory, templateTag } from '~~/server/db/schema/registry';
import { newId } from '~~/server/utils/ids';
import { principalHasScope, requirePrincipal } from '~~/server/utils/principals';
import { hydrateTemplate } from '~~/server/utils/projections';

export default defineEventHandler(async (event) => {
  const principal = await requirePrincipal(event);
  if (!principalHasScope(principal, 'registry:write')) {
    throw createError({ statusCode: 403, statusMessage: 'registry:write scope required' });
  }

  const body = await readBody(event);
  const parsed = templateCreateInput.safeParse(body);
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.message });
  }
  const input = parsed.data;
  const db = useDb();
  const id = newId('tpl');
  const now = new Date();
  const emptyPreview = { hero: null, thumbnail: null, gallery: [], demoUrl: null, repoUrl: null };

  await db.transaction(async (tx) => {
    await tx.insert(template).values({
      id,
      slug: input.slug,
      title: input.title,
      summary: input.summary,
      description: input.description,
      kind: input.kind,
      framework: input.framework,
      license: input.license,
      version: input.version ?? '0.1.0',
      visibility: input.visibility ?? 'public',
      pricing: input.pricing ?? 'free',
      priceCents: input.priceCents ?? 0,
      authorId: principal.userId,
      preview: input.preview ?? emptyPreview,
      install: input.install ?? [],
      components: input.components ?? [],
      dependencies: input.dependencies ?? [],
      ai: input.ai,
      status: 'draft',
      searchKeywords: [],
      createdAt: now,
      updatedAt: now,
    });
    if (input.categoryIds?.length) {
      await tx
        .insert(templateCategory)
        .values(input.categoryIds.map((cid) => ({ templateId: id, categoryId: cid })));
    }
    if (input.tagIds?.length) {
      await tx
        .insert(templateTag)
        .values(input.tagIds.map((tid) => ({ templateId: id, tagId: tid })));
    }
  });

  return await hydrateTemplate(id);
});
