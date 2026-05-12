import { and, desc, eq } from 'drizzle-orm';
import { useDb } from '~~/server/utils/db';
import { template } from '~~/server/db/schema/registry';
import { hydrateTemplate } from '~~/server/utils/projections';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const site = config.public.siteUrl;
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8');
  setHeader(event, 'Cache-Control', 'public, max-age=300');

  const db = useDb();
  const rows = await db
    .select({ id: template.id })
    .from(template)
    .where(and(eq(template.status, 'published'), eq(template.visibility, 'public')))
    .orderBy(desc(template.publishedAt));

  const entries: string[] = [];
  for (const row of rows) {
    const t = await hydrateTemplate(row.id);
    if (!t) continue;
    entries.push(
      [
        `## ${t.title}`,
        `URL: ${site}/templates/${t.slug}`,
        `Kind: ${t.kind} | Framework: ${t.framework} | License: ${t.license} | Pricing: ${t.pricing}`,
        `Author: ${t.author.name ?? t.author.handle ?? '?'}`,
        `Categories: ${t.categories.map((c) => c.name).join(', ')}`,
        `Tags: ${t.tags.map((tg) => tg.name).join(', ')}`,
        '',
        `Summary: ${t.summary}`,
        '',
        `AI:`,
        `  schemaVersion: ${t.ai.schemaVersion}`,
        `  purpose: ${t.ai.purpose}`,
        `  capabilities: ${t.ai.capabilities.join('; ')}`,
        t.ai.installHint ? `  installHint: ${t.ai.installHint}` : '',
        '',
      ]
        .filter(Boolean)
        .join('\n'),
    );
  }

  return `# Grayprint — full catalogue

${entries.join('\n')}`;
});
