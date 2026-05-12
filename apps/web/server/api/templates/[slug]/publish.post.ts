import { eq } from 'drizzle-orm';
import { publishRequest } from '@grayprint/schemas';
import { useDb } from '~/server/utils/db';
import { template, templateVersion } from '~/server/db/schema/registry';
import { newId } from '~/server/utils/ids';
import { principalHasScope, requirePrincipal } from '~/server/utils/principals';

export default defineEventHandler(async (event) => {
  const principal = await requirePrincipal(event);
  if (!principalHasScope(principal, 'registry:write')) {
    throw createError({ statusCode: 403, statusMessage: 'registry:write scope required' });
  }
  const slug = getRouterParam(event, 'slug');
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'slug required' });

  const body = await readBody(event).catch(() => ({}));
  const parsed = publishRequest.safeParse(body ?? {});
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.message });
  }
  const input = parsed.data;
  const db = useDb();

  const [existing] = await db
    .select({
      id: template.id,
      authorId: template.authorId,
      version: template.version,
      slug: template.slug,
    })
    .from(template)
    .where(eq(template.slug, slug))
    .limit(1);
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'template not found' });
  if (existing.authorId !== principal.userId) {
    throw createError({ statusCode: 403, statusMessage: 'not your template' });
  }

  const version = input.version ?? existing.version;
  const now = new Date();

  await db.transaction(async (tx) => {
    await tx
      .update(template)
      .set({ status: 'published', publishedAt: now, version, updatedAt: now })
      .where(eq(template.id, existing.id));
    await tx
      .insert(templateVersion)
      .values({
        id: newId('ver'),
        templateId: existing.id,
        version,
        changelog: input.changelog ?? '',
        publishedAt: now,
      })
      .onConflictDoNothing();
  });

  const config = useRuntimeConfig();
  return {
    ok: true as const,
    slug: existing.slug,
    version,
    publishedAt: now.toISOString(),
    url: `${config.public.siteUrl}/templates/${existing.slug}`,
  };
});
