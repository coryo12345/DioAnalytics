import type { OverallData } from '../models/server';
import { fillDateGapsWithZero } from './common';

export async function getUserData(userId: string, serverId: string, lookback: number) {
  let userData: OverallData[];
  try {
    const resp = await fetch(
      `${import.meta.env.DATASTORE_URL}/user?guild=${serverId}&user=${userId}&hours=${lookback}`
    );
    userData = await resp.json();
  } catch (err) {
    userData = [];
  }
  return fillDateGapsWithZero(userData);
}

export default getUserData;
