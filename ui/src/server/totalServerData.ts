import type { OverallData } from '../models/server';
import { fillDateGapsWithZero } from './common';

export async function getOverallData(serverId: string, lookback: number) {
  let summaryData: OverallData[];
  try {
    const url = import.meta.env.DATASTORE_URL ?? process.env.DATASTORE_URL;
    const resp = await fetch(`${url}/server?guild=${serverId}&hours=${lookback}`);
    summaryData = await resp.json();
  } catch (err) {
    console.error(err);
    summaryData = [];
  }
  return fillDateGapsWithZero(summaryData);
}

export default getOverallData;
