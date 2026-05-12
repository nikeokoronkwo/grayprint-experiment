import { z } from 'zod';
import { cuid, isoDate } from './primitives.js';

/** API key issued to an AI agent (or developer machine) — the "Agent Auth" surface. */
export const agentApiKey = z.object({
  id: cuid,
  userId: cuid,
  name: z.string().min(1).max(64),
  /** Last 4 chars of the key — full key is shown once at create-time, then hashed. */
  preview: z.string().length(8),
  scopes: z
    .array(z.enum(['registry:read', 'registry:write', 'mcp:call', 'agent:identify']))
    .default(['registry:read', 'mcp:call']),
  lastUsedAt: isoDate.nullable().default(null),
  expiresAt: isoDate.nullable().default(null),
  createdAt: isoDate,
});
export type AgentApiKey = z.infer<typeof agentApiKey>;

export const agentApiKeyCreateInput = z.object({
  name: z.string().min(1).max(64),
  scopes: agentApiKey.shape.scopes.optional(),
  expiresIn: z.number().int().positive().max(60 * 60 * 24 * 365).optional(),
});
export type AgentApiKeyCreateInput = z.infer<typeof agentApiKeyCreateInput>;

export const agentApiKeyCreateResult = agentApiKey.extend({
  /** Full plaintext key — only returned at creation. */
  key: z.string(),
});
export type AgentApiKeyCreateResult = z.infer<typeof agentApiKeyCreateResult>;
