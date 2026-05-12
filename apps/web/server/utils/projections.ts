import { and, eq, inArray } from 'drizzle-orm';
import type { PublicTemplate, TemplateCard } from '@grayprint/schemas';
import { useDb } from './db.js';
import { user } from '../db/schema/auth.js';
import {
  category as categoryTable,
  tag as tagTable,
  template,
  templateCategory,
  templateTag,
} from '../db/schema/registry.js';

/** Hydrate a template row into the public-facing shape. */
export async function hydrateTemplate(templateId: string): Promise<PublicTemplate | null> {
  const db = useDb();
  const [row] = await db.select().from(template).where(eq(template.id, templateId)).limit(1);
  if (!row) return null;

  const [author] = await db
    .select({
      id: user.id,
      handle: user.handle,
      name: user.name,
      avatarUrl: user.image,
      bio: user.bio,
      website: user.website,
    })
    .from(user)
    .where(eq(user.id, row.authorId))
    .limit(1);

  const cats = await db
    .select({
      id: categoryTable.id,
      slug: categoryTable.slug,
      name: categoryTable.name,
    })
    .from(templateCategory)
    .innerJoin(categoryTable, eq(categoryTable.id, templateCategory.categoryId))
    .where(eq(templateCategory.templateId, row.id));

  const tags = await db
    .select({ id: tagTable.id, slug: tagTable.slug, name: tagTable.name })
    .from(templateTag)
    .innerJoin(tagTable, eq(tagTable.id, templateTag.tagId))
    .where(eq(templateTag.templateId, row.id));

  return rowToPublic(row, author, cats, tags);
}

/** Bulk hydration — single round-trip for card grids. */
export async function hydrateTemplateCards(templateIds: string[]): Promise<TemplateCard[]> {
  if (templateIds.length === 0) return [];
  const db = useDb();

  const rows = await db.select().from(template).where(inArray(template.id, templateIds));
  if (rows.length === 0) return [];

  const authors = await db
    .select({
      id: user.id,
      handle: user.handle,
      name: user.name,
      avatarUrl: user.image,
      bio: user.bio,
      website: user.website,
    })
    .from(user)
    .where(inArray(user.id, rows.map((r) => r.authorId)));
  const authorById = new Map(authors.map((a) => [a.id, a]));

  const cats = await db
    .select({
      templateId: templateCategory.templateId,
      id: categoryTable.id,
      slug: categoryTable.slug,
      name: categoryTable.name,
    })
    .from(templateCategory)
    .innerJoin(categoryTable, eq(categoryTable.id, templateCategory.categoryId))
    .where(inArray(templateCategory.templateId, templateIds));

  const tagRows = await db
    .select({
      templateId: templateTag.templateId,
      id: tagTable.id,
      slug: tagTable.slug,
      name: tagTable.name,
    })
    .from(templateTag)
    .innerJoin(tagTable, eq(tagTable.id, templateTag.tagId))
    .where(inArray(templateTag.templateId, templateIds));

  return rows.map((row) =>
    rowToCard(
      row,
      authorById.get(row.authorId)!,
      cats.filter((c) => c.templateId === row.id).map(({ templateId, ...rest }) => rest),
      tagRows.filter((t) => t.templateId === row.id).map(({ templateId, ...rest }) => rest),
    ),
  );
}

type TemplateRow = Awaited<ReturnType<typeof useDb>> extends never ? never : Awaited<ReturnType<ReturnType<typeof useDb>['select']>>;

function rowToPublic(
  row: any,
  author: any,
  categories: Array<{ id: string; slug: string; name: string }>,
  tags: Array<{ id: string; slug: string; name: string }>,
): PublicTemplate {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    description: row.description,
    kind: row.kind,
    framework: row.framework,
    license: row.license,
    version: row.version,
    status: row.status,
    visibility: row.visibility,
    pricing: row.pricing,
    priceCents: row.priceCents,
    preview: row.preview ?? {},
    install: row.install ?? [],
    components: row.components ?? [],
    dependencies: row.dependencies ?? [],
    ai: row.ai,
    searchKeywords: row.searchKeywords ?? [],
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    categoryIds: categories.map((c) => c.id),
    tagIds: tags.map((t) => t.id),
    author: {
      id: author?.id ?? '',
      handle: author?.handle ?? null,
      name: author?.name ?? null,
      avatarUrl: author?.avatarUrl ?? null,
      bio: author?.bio ?? null,
      website: author?.website ?? null,
    },
    categories,
    tags,
  };
}

function rowToCard(
  row: any,
  author: any,
  categories: Array<{ id: string; slug: string; name: string }>,
  tags: Array<{ id: string; slug: string; name: string }>,
): TemplateCard {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    kind: row.kind,
    framework: row.framework,
    pricing: row.pricing,
    preview: row.preview ?? {},
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
    author: {
      id: author?.id ?? '',
      handle: author?.handle ?? null,
      name: author?.name ?? null,
      avatarUrl: author?.avatarUrl ?? null,
      bio: author?.bio ?? null,
      website: author?.website ?? null,
    },
    categories,
    tags,
  };
}
