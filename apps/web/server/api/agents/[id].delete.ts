import { useAuth } from '~/server/utils/auth';
import { requireUser } from '~/server/utils/principals';

export default defineEventHandler(async (event) => {
  await requireUser(event);
  const id = getRouterParam(event, 'id');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id required' });
  const auth = useAuth();
  await auth.api.deleteApiKey({ headers: event.headers, body: { keyId: id } });
  return { ok: true };
});
