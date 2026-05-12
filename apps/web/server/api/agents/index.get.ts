import { useAuth } from '~/server/utils/auth';
import { requireUser } from '~/server/utils/principals';

export default defineEventHandler(async (event) => {
  await requireUser(event);
  const auth = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (auth.api as any).listApiKeys({ headers: event.headers });
});
