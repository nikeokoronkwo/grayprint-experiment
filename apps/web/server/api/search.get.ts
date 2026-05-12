import { and, desc, eq, sql } from 'drizzle-orm';
import { searchQuery } from '@grayprint/schemas';
import { useDb } from '~/server/utils/db';
import { template } from '~/server/db/schema/registry';
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

  const rows = await db
    .select({ id: template.id })
    .from(template)
    .where(and(...filters))
    .orderBy(orderBy)
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
