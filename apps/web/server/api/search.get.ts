import { and, count, desc, eq, inArray, sql } from 'drizzle-orm';
import { searchQuery } from '@grayprint/schemas';
import { useDb } from '~~/server/utils/db';
import { category, tag, template, templateCategory, templateTag } from '~~/server/db/schema/registry';
import { hydrateTemplateCards } from '~~/server/utils/projections';

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

  if (q.category) {
    const cats = await db.select({ id: category.id }).from(category).where(eq(category.slug, q.category));
    if (cats.length === 0) return { items: [], total: 0, page: q.page, perPage: q.perPage };
    const links = await db
      .select({ id: templateCategory.templateId })
      .from(templateCategory)
      .where(eq(templateCategory.categoryId, cats[0]!.id));
    const ids = links.map((l) => l.id);
    if (ids.length === 0) return { items: [], total: 0, page: q.page, perPage: q.perPage };
    filters.push(inArray(template.id, ids));
  }
  if (q.tag) {
    const tags = await db.select({ id: tag.id }).from(tag).where(eq(tag.slug, q.tag));
    if (tags.length === 0) return { items: [], total: 0, page: q.page, perPage: q.perPage };
    const links = await db
      .select({ id: templateTag.templateId })
      .from(templateTag)
      .where(eq(templateTag.tagId, tags[0]!.id));
    const ids = links.map((l) => l.id);
    if (ids.length === 0) return { items: [], total: 0, page: q.page, perPage: q.perPage };
    filters.push(inArray(template.id, ids));
  }

  const queryText = q.q.trim();
  const useFts = queryText.length > 0;

  if (useFts) {
    // websearch_to_tsquery is forgiving: bare words, "quoted phrases", -negations, OR.
    filters.push(
      sql`${template.searchVector} @@ websearch_to_tsquery('english', ${queryText})`,
    );
  }

  const orderBy = useFts
    ? sql`ts_rank(${template.searchVector}, websearch_to_tsquery('english', ${queryText})) desc`
    : desc(template.publishedAt);

  const where = and(...filters);

  const [rows, [totals]] = await Promise.all([
    db
      .select({ id: template.id })
      .from(template)
      .where(where)
      .orderBy(orderBy)
      .limit(q.perPage)
      .offset((q.page - 1) * q.perPage),
    db.select({ n: count() }).from(template).where(where),
  ]);
  const total = Number(totals?.n ?? 0);

  const items = await hydrateTemplateCards(rows.map((r) => r.id));
  return {
    items,
    total,
    page: q.page,
    perPage: q.perPage,
  };
});
