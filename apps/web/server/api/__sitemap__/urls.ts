import type { SitemapUrlInput } from '#sitemap/types';
import { and, desc, eq } from 'drizzle-orm';
import { category, tag, template } from '~~/server/db/schema/registry';
import { useDb } from '~~/server/utils/db';

/**
 * Dynamic URL source for @nuxtjs/sitemap. Only emits DB-backed detail pages
 * so content changes are reflected without a rebuild; static routes are
 * declared in nuxt.config.ts. Categories and tags have no `lastmod` because
 * the registry doesn't track their update time.
 */
export default defineSitemapEventHandler(async () => {
  const db = useDb();
  const [templates, categories, tags] = await Promise.all([
    db
      .select({ slug: template.slug, updatedAt: template.updatedAt })
      .from(template)
      .where(and(eq(template.status, 'published'), eq(template.visibility, 'public')))
      .orderBy(desc(template.updatedAt)),
    db.select({ slug: category.slug }).from(category),
    db.select({ slug: tag.slug }).from(tag),
  ]);

  return [
    ...templates.map((t) => ({ loc: `/templates/${t.slug}`, lastmod: t.updatedAt })),
    ...categories.map((c) => ({ loc: `/categories/${c.slug}` })),
    ...tags.map((t) => ({ loc: `/tags/${t.slug}` })),
  ] satisfies SitemapUrlInput[];
});
