import type { APIRoute } from 'astro';
import getUserData from '../../server/userData';

export const get: APIRoute = async (context) => {
  let serverId: string | null;
  let lookbackStr: string | null;
  let userId: string | null;
  const searchStr = context.request.url.split('?')[1];
  if (!searchStr) return new Response(null, { status: 400 });
  const params = new URLSearchParams(searchStr);

  lookbackStr = params.get('lookback');
  serverId = params.get('serverId');
  userId = params.get('userId');
  if (!serverId || !lookbackStr || !userId) return new Response(null, { status: 400 });
  const lookback = parseInt(lookbackStr);
  if (isNaN(lookback)) return new Response(null, { status: 400 });

  const data = await getUserData(userId, serverId, lookback);
  return {
    body: JSON.stringify(data),
  };
};
