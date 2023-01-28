import type { APIRoute } from 'astro';
import getOverallData from '../../server/totalServerData';

export const get: APIRoute = async (context) => {
  let serverId: string | null;
  let lookbackStr: string | null;
  const searchStr = context.request.url.split('?')[1];
  if (!searchStr) return new Response(null, { status: 400 });
  const params = new URLSearchParams(searchStr);

  lookbackStr = params.get('lookback');
  serverId = params.get('serverId');
  if (!serverId || !lookbackStr) return new Response(null, { status: 400 });
  const lookback = parseInt(lookbackStr);
  if (isNaN(lookback)) return new Response(null, { status: 400 });

  const data = await getOverallData(serverId, lookback);
  return {
    body: JSON.stringify(data),
  };
};
