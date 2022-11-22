import type { APIRoute } from 'astro';
import { getUserDetailsFromCache } from '../../discord/userCache';

export const get: APIRoute = async (context) => {
  let userId: string | null;
  const searchStr = context.request.url.split('?')[1];
  if (!searchStr) return new Response(null, { status: 400 });
  const params = new URLSearchParams(searchStr);
  userId = params.get('userId');
  if (!userId) return new Response(null, { status: 400 });

  const user = await getUserDetailsFromCache(userId);
  return {
    body: JSON.stringify(user),
  };
};
