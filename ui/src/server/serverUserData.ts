import type { UserTimeSummary } from '../models/server';

export async function getUserData(serverId: string, lookback: number) {
  let userData: UserTimeSummary[];
  try {
    const resp = await fetch(`${import.meta.env.DATASTORE_URL}/users?guild=${serverId}&days=${lookback}`);
    userData = await resp.json();
  } catch (err) {
    userData = [];
  }
  return userData;
}

export default getUserData;
