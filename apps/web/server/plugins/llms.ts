import { and, desc, eq } from 'drizzle-orm';
import type { PublicTemplate } from '@grayprint/schemas';
import { useDb } from '~~/server/utils/db';
import { template } from '~~/server/db/schema/registry';
import { hydrateTemplate } from '~~/server/utils/projections';

/**
 * Injects the published template catalogue into nuxt-llms output.
 *
 * - llms.txt gains a "Templates" section linking to every published template.
 * - llms-full.txt gains a per-template markdown block (title, URL, kind/
 *   framework/license/pricing, author, categories, tags, summary, AI metadata).
 *
 * The previous hand-rolled handler also set a 5-minute Cache-Control; preserved
 * here on the H3 event since nuxt-llms only sets Content-Type.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('llms:generate', async (event, options) => {
    setHeader(event, 'Cache-Control', 'public, max-age=300');
    const templates = await fetchPublishedTemplates();
    if (templates.length === 0) return;
    options.sections.push({
      title: 'Templates',
      description: 'Published templates in the Grayprint marketplace.',
      links: templates.map((t) => ({
        title: t.title,
        description: t.summary,
        href: `${options.domain}/templates/${t.slug}`,
      })),
    });
  });

  nitroApp.hooks.hook('llms:generate:full', async (event, options, contents) => {
    setHeader(event, 'Cache-Control', 'public, max-age=300');
    const templates = await fetchPublishedTemplates();
    if (templates.length === 0) return;
    contents.push(
      ['## Templates', '', ...templates.flatMap((t) => [renderTemplateBlock(t, options.domain), ''])].join('\n'),
    );
  });
});

async function fetchPublishedTemplates(): Promise<PublicTemplate[]> {
  const db = useDb();
  const rows = await db
    .select({ id: template.id })
    .from(template)
    .where(and(eq(template.status, 'published'), eq(template.visibility, 'public')))
    .orderBy(desc(template.publishedAt));
  const hydrated = await Promise.all(rows.map((r) => hydrateTemplate(r.id)));
  return hydrated.filter((t): t is PublicTemplate => t !== null);
}

function renderTemplateBlock(t: PublicTemplate, domain: string): string {
  const lines = [
    `### ${t.title}`,
    `URL: ${domain}/templates/${t.slug}`,
    `Kind: ${t.kind} | Framework: ${t.framework} | License: ${t.license} | Pricing: ${t.pricing}`,
    `Author: ${t.author.name ?? t.author.handle ?? '?'}`,
    `Categories: ${t.categories.map((c) => c.name).join(', ')}`,
    `Tags: ${t.tags.map((tg) => tg.name).join(', ')}`,
    '',
    `Summary: ${t.summary}`,
    '',
    'AI:',
    `  schemaVersion: ${t.ai.schemaVersion}`,
    `  purpose: ${t.ai.purpose}`,
    `  capabilities: ${t.ai.capabilities.join('; ')}`,
  ];
  if (t.ai.installHint) lines.push(`  installHint: ${t.ai.installHint}`);
  return lines.join('\n');
}
