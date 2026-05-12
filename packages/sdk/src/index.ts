import { ofetch, type $Fetch } from 'ofetch';
import type {
  AgentApiKeyCreateInput,
  AgentApiKeyCreateResult,
  Category,
  PublicTemplate,
  PublishRequest,
  PublishResult,
  SearchQuery,
  SearchResponse,
  Tag,
  TemplateCard,
  TemplateCreateInput,
  TemplateUpdateInput,
} from '@grayprint/schemas';

export interface GrayprintClientOptions {
  apiUrl?: string;
  token?: string;
  fetch?: typeof globalThis.fetch;
}

export class GrayprintClient {
  readonly apiUrl: string;
  readonly token: string | undefined;
  private readonly http: $Fetch;

  constructor(opts: GrayprintClientOptions = {}) {
    this.apiUrl = (opts.apiUrl ?? process.env.GRAYPRINT_API_URL ?? 'https://grayprint.dev').replace(
      /\/$/,
      '',
    );
    this.token = opts.token ?? process.env.GRAYPRINT_TOKEN ?? undefined;
    this.http = ofetch.create({
      baseURL: `${this.apiUrl}/api`,
      retry: 1,
      headers: this.token ? { authorization: `Bearer ${this.token}` } : undefined,
      ...(opts.fetch ? { fetch: opts.fetch as typeof fetch } : {}),
    });
  }

  /** Issue a new SDK with a different token (e.g. switching accounts in the CLI). */
  withToken(token: string) {
    return new GrayprintClient({ apiUrl: this.apiUrl, token });
  }

  /** Search across published templates. */
  search(query: Partial<SearchQuery> = {}): Promise<SearchResponse> {
    return this.http<SearchResponse>('/search', { query: query as Record<string, unknown> });
  }

  /** List templates with optional filters (slightly different from /search — no FTS). */
  listTemplates(query: Partial<SearchQuery> = {}): Promise<{ items: TemplateCard[]; total: number; page: number; perPage: number }> {
    return this.http('/templates', { query: query as Record<string, unknown> });
  }

  /** Fetch the full public record for a template. */
  getTemplate(slug: string): Promise<PublicTemplate> {
    return this.http<PublicTemplate>(`/templates/${encodeURIComponent(slug)}`);
  }

  /** Create a new template (draft). Requires registry:write. */
  createTemplate(input: TemplateCreateInput): Promise<PublicTemplate> {
    return this.http<PublicTemplate>('/templates', { method: 'POST', body: input });
  }

  /** Update an existing template by slug. Requires registry:write. */
  updateTemplate(slug: string, input: TemplateUpdateInput): Promise<PublicTemplate> {
    return this.http<PublicTemplate>(`/templates/${encodeURIComponent(slug)}`, {
      method: 'PATCH',
      body: input,
    });
  }

  /** Publish a template version. */
  publishTemplate(slug: string, req: PublishRequest = {}): Promise<PublishResult> {
    return this.http<PublishResult>(`/templates/${encodeURIComponent(slug)}/publish`, {
      method: 'POST',
      body: req,
    });
  }

  /** Delete a template you own. */
  deleteTemplate(slug: string): Promise<{ ok: true }> {
    return this.http(`/templates/${encodeURIComponent(slug)}`, { method: 'DELETE' });
  }

  listCategories(): Promise<Category[]> {
    return this.http<Category[]>('/categories');
  }

  getCategory(slug: string): Promise<Category> {
    return this.http<Category>(`/categories/${encodeURIComponent(slug)}`);
  }

  listTags(): Promise<Tag[]> {
    return this.http<Tag[]>('/tags');
  }

  /** Whoami — verifies the current bearer/session, returns principal. */
  whoami(): Promise<{ userId: string; kind: 'user' | 'apiKey'; permissions?: unknown }> {
    return this.http('/agents/me');
  }

  /** Issue an agent API key. Session-only (not callable with an API key). */
  createAgentKey(input: AgentApiKeyCreateInput): Promise<AgentApiKeyCreateResult> {
    return this.http<AgentApiKeyCreateResult>('/agents', { method: 'POST', body: input });
  }

  listAgentKeys(): Promise<unknown[]> {
    return this.http('/agents');
  }

  revokeAgentKey(id: string): Promise<{ ok: true }> {
    return this.http(`/agents/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }
}

export type { GrayprintClient as default };
