import type { OverallData } from '../models/server';

export async function getUserData(userId: string, serverId: string, lookback: number) {
  let userData: OverallData[];
  try {
    // TODO: build this endpoint on datastore
    const resp = await fetch(`${import.meta.env.DATASTORE_URL}/user?guild=${serverId}&user=${userId}&days=${lookback}`);
    userData = await resp.json();
  } catch (err) {
    userData = [];
  }
  return userData;
}

export default getUserData;
