import { and, desc, eq, inArray } from 'drizzle-orm';
import { searchQuery } from '@grayprint/schemas';
import { useDb } from '~/server/utils/db';
import { template, templateCategory, templateTag, category, tag } from '~/server/db/schema/registry';
import { hydrateTemplateCards } from '~/server/utils/projections';

export default defineEventHandler(async (event) => {
  const parsed = searchQuery.safeParse(getQuery(event));
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.message });
  }
  const q = parsed.data;
  const db = useDb();

  const filters = [eq(template.status, 'published'), eq(template.visibility, 'public')];
  if (q.kind) filters.push(eq(template.kind, q.kind));
  if (q.framework) filters.push(eq(template.framework, q.framework));
  if (q.pricing) filters.push(eq(template.pricing, q.pricing));

  let templateIds: string[] | null = null;
  if (q.category) {
    const cats = await db.select({ id: category.id }).from(category).where(eq(category.slug, q.category));
    if (cats.length === 0) return { items: [], total: 0, page: q.page, perPage: q.perPage };
    const links = await db
      .select({ id: templateCategory.templateId })
      .from(templateCategory)
      .where(eq(templateCategory.categoryId, cats[0].id));
    templateIds = links.map((l) => l.id);
    if (templateIds.length === 0) return { items: [], total: 0, page: q.page, perPage: q.perPage };
    filters.push(inArray(template.id, templateIds));
  }
  if (q.tag) {
    const tags = await db.select({ id: tag.id }).from(tag).where(eq(tag.slug, q.tag));
    if (tags.length === 0) return { items: [], total: 0, page: q.page, perPage: q.perPage };
    const links = await db
      .select({ id: templateTag.templateId })
      .from(templateTag)
      .where(eq(templateTag.tagId, tags[0].id));
    const ids = links.map((l) => l.id);
    if (ids.length === 0) return { items: [], total: 0, page: q.page, perPage: q.perPage };
    filters.push(inArray(template.id, ids));
  }

  const rows = await db
    .select({ id: template.id })
    .from(template)
    .where(and(...filters))
    .orderBy(desc(template.publishedAt))
    .limit(q.perPage)
    .offset((q.page - 1) * q.perPage);

  const items = await hydrateTemplateCards(rows.map((r) => r.id));

  return {
    items,
    total: items.length,
    page: q.page,
    perPage: q.perPage,
  };
});
