import { Database, open } from 'sqlite';
import { Database as DBDriver } from 'sqlite3';

const DB_LOC = 'data/data.db';

let _db: Database;

async function getDb() {
  if (_db) return _db;
  _db = await open({
    filename: DB_LOC,
    driver: DBDriver,
  });
  _db.exec('PRAGMA journal_mode=WAL;');
  // TODO: read from init.sql to init ddl
}

export async function addUserEntry(guildId: string, userId: string, timestamp: string) {
  const db = await getDb();
}
