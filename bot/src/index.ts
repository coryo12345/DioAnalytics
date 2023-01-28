import { registerCommands } from './commands';
import { startBot } from './bot';

require('dotenv').config();

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const TIMELOG_URL = process.env.TIMELOG_URL;
const DATASTORE_URL = process.env.DATASTORE_URL;

(async () => {
  // see commands.json
  await registerCommands(BOT_TOKEN, CLIENT_ID);

  startBot(BOT_TOKEN, TIMELOG_URL, DATASTORE_URL);
})();
