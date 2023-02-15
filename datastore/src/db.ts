import { Database, open } from 'sqlite';
import { Database as DBDriver } from 'sqlite3';
import { readFileSync } from 'fs';
import {
  CHECK_USER_TRACK_STATUS,
  CLEAR_ALL_LOGS,
  INSERT_RAW_LOG,
  OPT_USER_IN,
  OPT_USER_OUT,
  PROCESS_RAW_LOGS,
  REMOVE_RAW_LOG,
  TIME_BY_SERVER,
  TIME_BY_USER,
  TIME_PER_USER,
  TOTAL_TIME_BY_SERVER,
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

  const checkStatusQuery = CHECK_USER_TRACK_STATUS;
  const checkStmt = await db.prepare(checkStatusQuery, userId);
  const users = await checkStmt.all();
  if (users.length > 0) {
    return;
  }

  const insertQuery = INSERT_RAW_LOG;
  const stmt = await db.prepare(insertQuery, guildId, userId, timestamp);
  stmt.run();
}

export async function removeUserEntry(guildId: string, userId: string) {
  const db = await getDb();
  const query = REMOVE_RAW_LOG;
  const stmt = await db.prepare(query, guildId, userId);
  stmt.run();
}

export async function removeAllUserEntries() {
  const db = await getDb();
  const query = CLEAR_ALL_LOGS;
  db.exec(query);
  return 1;
}

export async function processRawLogs() {
  const db = await getDb();
  const query = PROCESS_RAW_LOGS;
  db.exec(query);
}

export async function optOutUser(userId: string) {
  const db = await getDb();
  const query = OPT_USER_OUT;
  const stmt = await db.prepare(query, userId);
  stmt.run();
}

export async function optInUser(userId: string) {
  const db = await getDb();
  const query = OPT_USER_IN;
  const stmt = await db.prepare(query, userId);
  stmt.run();
}

export async function getServerDataByLookback(guildId: string, hours: number): Promise<TotalServerData> {
  const modifier = `-${hours} hours`;
  const db = await getDb();

  const dataPointsQuery = TIME_BY_SERVER;
  const totalTimeQuery = TOTAL_TIME_BY_SERVER;
  let [dataPointsResults, totalTime] = await Promise.all([
    db.all(dataPointsQuery, guildId, modifier),
    db.get(totalTimeQuery, guildId, modifier),
  ]);

  const data = dataPointsResults.map((result) => {
    const d = new Date(result.day);
    return {
      time: result.time,
      day: new Date(d.getTime() + 3600000 * result.hour),
    };
  });

  return {
    total: totalTime.time,
    data,
  };
}

export async function getUsersDataByServerAndLookback(guildId: string, hours: number) {
  const modifier = `-${hours} hours`;
  const db = await getDb();
  const query = TIME_PER_USER;
  const results = db.all(query, guildId, modifier);
  return results;
}

export async function getSingleUserDataByServerAndLookback(guildId: string, userId: string, hours: number) {
  const modifier = `-${hours} hours`;
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
