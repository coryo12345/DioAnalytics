import type { TotalServerData } from '../models/server';
import { fillDateGapsWithZero } from './common';

export async function getOverallData(serverId: string, lookback: number) {
  let summaryData: TotalServerData;
  try {
    const url = import.meta.env.DATASTORE_URL ?? process.env.DATASTORE_URL;
    const resp = await fetch(`${url}/server?guild=${serverId}&hours=${lookback}`);
    summaryData = await resp.json();
  } catch (err) {
    console.error(err);
    summaryData = { total: 0, data: [] };
  }
  summaryData.data = fillDateGapsWithZero(summaryData.data);
  return summaryData;
}

export default getOverallData;
