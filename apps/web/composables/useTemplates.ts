import type { SearchQuery, TemplateCard } from '@grayprint/schemas';

type SearchResult = { items: TemplateCard[]; total: number; page: number; perPage: number };

export function useTemplateSearch(query: () => Partial<SearchQuery>) {
  return useAsyncData<SearchResult>(
    () => `templates:${JSON.stringify(query())}`,
    () =>
      $fetch<SearchResult>('/api/search', {
        query: query() as Record<string, string | number | undefined>,
      }),
    { watch: [query], default: () => ({ items: [], total: 0, page: 1, perPage: 24 }) },
  );
}

export function useTemplate(slug: () => string) {
  return useAsyncData(
    () => `template:${slug()}`,
    () => $fetch(`/api/templates/${slug()}`),
    { watch: [slug] },
  );
}
