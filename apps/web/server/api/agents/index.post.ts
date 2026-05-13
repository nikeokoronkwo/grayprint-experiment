import { agentApiKeyCreateInput } from '@grayprint/schemas';
import { useAuth } from '~~/server/utils/auth';
import { requireUser } from '~~/server/utils/principals';

export default defineEventHandler(async (event) => {
  const principal = await requireUser(event);
  const body = await readBody(event);
  const parsed = agentApiKeyCreateInput.safeParse(body);
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.message });
  }
  const auth = useAuth();
  // better-auth's apiKey plugin treats the presence of `headers` as a
  // client-initiated call and rejects server-only fields like `permissions`.
  // Pass `userId` from the authenticated principal instead.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await (auth.api as any).createApiKey({
    body: {
      name: parsed.data.name,
      userId: principal.userId,
      permissions: { registry: ['read', 'write'], mcp: ['call'] },
      expiresIn: parsed.data.expiresIn,
    },
  });
  return result;
});
