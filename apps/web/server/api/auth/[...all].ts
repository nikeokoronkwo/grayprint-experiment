import { useAuth } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const auth = useAuth();
  return auth.handler(toWebRequest(event));
});
