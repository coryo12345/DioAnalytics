import type { OverallData } from '../models/server';

export async function getOverallData(serverId: string, lookback: number) {
  let summaryData: OverallData[];
  try {
    const resp = await fetch(`${import.meta.env.DATASTORE_URL}/server?guild=${serverId}&days=${lookback}`);
    summaryData = await resp.json();
  } catch (err) {
    summaryData = [];
  }
  return summaryData;
}

export default getOverallData;
