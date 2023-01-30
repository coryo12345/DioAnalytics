import type { OverallData } from '../models/server';
import { fillDateGapsWithZero } from './common';

export async function getOverallData(serverId: string, lookback: number) {
  let summaryData: OverallData[];
  try {
    const resp = await fetch(`${import.meta.env.DATASTORE_URL}/server?guild=${serverId}&hours=${lookback}`);
    summaryData = await resp.json();
  } catch (err) {
    summaryData = [];
  }
  return fillDateGapsWithZero(summaryData);
}

export default getOverallData;
