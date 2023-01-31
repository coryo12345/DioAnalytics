import type { UserTimeSummary } from '../models/server';

export async function getUserData(serverId: string, lookback: number) {
  let userData: UserTimeSummary[];
  try {
    const url = import.meta.env.DATASTORE_URL ?? process.env.DATASTORE_URL;
    const resp = await fetch(`${url}/users?guild=${serverId}&hours=${lookback}`);
    userData = await resp.json();
  } catch (err) {
    console.error(err);
    userData = [];
  }
  return userData;
}

export default getUserData;
