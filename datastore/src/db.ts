import { Database, open } from 'sqlite';
import { Database as DBDriver } from 'sqlite3';
import { readFileSync } from 'fs';
import { INSERT_RAW_LOG, PROCESS_RAW_LOGS } from './sql/queries';

const DB_LOC = 'data/data.db';
const INIT_FILE = 'src/sql/init.sql';

let _db: Database;

async function getDb() {
  if (_db) return _db;
  _db = await open({
    filename: DB_LOC,
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

export async function processRawLogs() {
  const db = await getDb();
  const query = PROCESS_RAW_LOGS;
  db.exec(query);
}
