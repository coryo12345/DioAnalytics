import type { OverallData } from '../models/server';
import { fillDateGapsWithZero } from './common';

export async function getUserData(userId: string, serverId: string, lookback: number) {
  let userData: OverallData[];
  try {
    const url = import.meta.env.DATASTORE_URL ?? process.env.DATASTORE_URL;
    const resp = await fetch(`${url}/user?guild=${serverId}&user=${userId}&hours=${lookback}`);
    userData = await resp.json();
  } catch (err) {
    console.error(err);
    userData = [];
  }
  return fillDateGapsWithZero(userData);
}

export default getUserData;
