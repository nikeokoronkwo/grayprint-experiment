import { useAuth } from '~/server/utils/auth';
import { requireUser } from '~/server/utils/principals';

export default defineEventHandler(async (event) => {
  await requireUser(event);
  const auth = useAuth();
  return auth.api.listApiKeys({ headers: event.headers });
});
