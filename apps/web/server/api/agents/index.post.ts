import { agentApiKeyCreateInput } from '@grayprint/schemas';
import { useAuth } from '~/server/utils/auth';
import { requireUser } from '~/server/utils/principals';

export default defineEventHandler(async (event) => {
  await requireUser(event);
  const body = await readBody(event);
  const parsed = agentApiKeyCreateInput.safeParse(body);
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.message });
  }
  const auth = useAuth();
  const result = await auth.api.createApiKey({
    headers: event.headers,
    body: {
      name: parsed.data.name,
      permissions: { registry: ['read', 'write'], mcp: ['call'] },
      expiresIn: parsed.data.expiresIn,
    },
  });
  return result;
});
