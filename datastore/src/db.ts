import { Database, open } from 'sqlite';
import { Database as DBDriver } from 'sqlite3';
import { readFileSync } from 'fs';
import {
  INSERT_RAW_LOG,
  PROCESS_RAW_LOGS,
  REMOVE_RAW_LOG,
  TIME_BY_SERVER,
  TIME_BY_USER,
  TIME_PER_USER,
} from './sql/queries';
import * as path from 'path';
import * as fs from 'fs';

const DB_LOC = '../data/data.db';
const INIT_FILE = 'src/sql/init.sql';

let _db: Database;

getDb();

async function getDb() {
  if (_db) return _db;
  fs.mkdirSync(path.resolve(__dirname, '../data'), { recursive: true });
  const dbPath = path.resolve(__dirname, DB_LOC);
  _db = await open({
    filename: dbPath,
    driver: DBDriver,
  });
  const sql = readFileSync(INIT_FILE, { encoding: 'utf-8' });
  _db.exec(sql);
  return _db;
}

export async function addUserEntry(guildId: string, userId: string, timestamp: string) {
  const db = await getDb();
  const query = INSERT_RAW_LOG;
  const stmt = await db.prepare(query, guildId, userId, timestamp);
  stmt.run();
}

export async function removeUserEntry(guildId: string, userId: string) {
  const db = await getDb();
  const query = REMOVE_RAW_LOG;
  const stmt = await db.prepare(query, guildId, userId);
  stmt.run();
}

export async function processRawLogs() {
  const db = await getDb();
  const query = PROCESS_RAW_LOGS;
  db.exec(query);
}

export async function getServerDataByLookback(guildId: string, days: number) {
  const modifier = `-${days} days`;
  const db = await getDb();
  const query = TIME_BY_SERVER;
  const results = db.all(query, guildId, modifier);

  return (await results).map((result) => {
    const d = new Date(result.day);
    return {
      time: result.time,
      day: new Date(d.getTime() + 3600000 * result.hour),
    };
  });
}

export async function getUsersDataByServerAndLookback(guildId: string, days: number) {
  const modifier = `-${days} days`;
  const db = await getDb();
  const query = TIME_PER_USER;
  const results = db.all(query, guildId, modifier);
  return results;
}

export async function getSingleUserDataByServerAndLookback(guildId: string, userId: string, days: number) {
  const modifier = `-${days} days`;
  const db = await getDb();
  const query = TIME_BY_USER;
  const results = db.all(query, guildId, userId, modifier);

  return (await results).map((result) => {
    const d = new Date(result.day);
    return {
      time: result.time,
      day: new Date(d.getTime() + 3600000 * result.hour),
    };
  });
}
