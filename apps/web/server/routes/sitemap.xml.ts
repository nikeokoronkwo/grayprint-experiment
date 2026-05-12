import { and, desc, eq } from 'drizzle-orm';
import { useDb } from '~/server/utils/db';
import { category, tag, template } from '~/server/db/schema/registry';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const site = config.public.siteUrl.replace(/\/$/, '');
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
  setHeader(event, 'Cache-Control', 'public, max-age=900');

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

  const urls: string[] = [
    `<url><loc>${site}/</loc></url>`,
    `<url><loc>${site}/templates</loc></url>`,
    `<url><loc>${site}/categories</loc></url>`,
    `<url><loc>${site}/docs</loc></url>`,
    `<url><loc>${site}/search</loc></url>`,
  ];
  for (const t of templates) {
    urls.push(
      `<url><loc>${site}/templates/${t.slug}</loc><lastmod>${t.updatedAt.toISOString()}</lastmod></url>`,
    );
  }
  for (const c of categories) urls.push(`<url><loc>${site}/categories/${c.slug}</loc></url>`);
  for (const tg of tags) urls.push(`<url><loc>${site}/tags/${tg.slug}</loc></url>`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
});
