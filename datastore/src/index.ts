import express from 'express';
import {
  addUserEntry,
  getServerDataByLookback,
  getSingleUserDataByServerAndLookback,
  getUsersDataByServerAndLookback,
  processRawLogs,
  removeAllUserEntries,
  removeUserEntry,
} from './db';

const PORT = 3001;
const DEFAULT_LOOKBACK = '7';

const app = express();
app.use(express.json());

// HEARTBEAT ==========================================
// If we haven't heard from the bot within the last HEARTBEAT_MAX_GAP ms,
// then clear all current active users so we don't incorrectly record time
const HEARTBEAT_MAX_GAP = 1000 * 60 * 5; // 5 min
const HEARTBEAT_CHECK = 1000 * 60; // 1 min
let lastHeartbeatTime = new Date();

app.get('/log/heartbeat', (req, res) => {
  lastHeartbeatTime = new Date();
  return res.send({});
});

setInterval(() => {
  const now = new Date();
  if (now.getTime() - lastHeartbeatTime.getTime() >= HEARTBEAT_MAX_GAP) {
    removeAllUserEntries();
  }
}, HEARTBEAT_CHECK);
// ====================================================

app.post('/log/join', (req, res) => {
  const guildId = req.query.guild ? req.query.guild.toString() : null;
  const userId = req.query.user ? req.query.user.toString() : null;
  if (guildId === null || userId === null) {
    res.sendStatus(400);
    return;
  }
  const now = new Date().toISOString();
  addUserEntry(guildId, userId, now);
  res.send({});
});

app.post('/log/exit', (req, res) => {
  const guildId = req.query.guild ? req.query.guild.toString() : null;
  const userId = req.query.user ? req.query.user.toString() : null;
  if (guildId === null || userId === null) {
    res.sendStatus(400);
    return;
  }
  removeUserEntry(guildId, userId);
  res.send({});
});

app.get('/server', async (req, res) => {
  const guildId = req.query.guild ? req.query.guild.toString() : null;
  if (guildId === null) {
    res.sendStatus(400);
    return;
  }
  const hoursStr = req.query.hours ? req.query.hours.toString() : DEFAULT_LOOKBACK;
  let hours: number;
  try {
    hours = parseInt(hoursStr);
  } catch (err) {
    res.sendStatus(400);
    return;
  }
  const data: TotalServerData = await getServerDataByLookback(guildId, hours);
  res.send(data);
});

app.get('/users', async (req, res) => {
  const guildId = req.query.guild ? req.query.guild.toString() : null;
  if (guildId === null) {
    res.sendStatus(400);
    return;
  }
  const hoursStr = req.query.hours ? req.query.hours.toString() : DEFAULT_LOOKBACK;
  let hours: number;
  try {
    hours = parseInt(hoursStr);
  } catch (err) {
    res.sendStatus(400);
    return;
  }
  const data = await getUsersDataByServerAndLookback(guildId, hours);
  res.send(data);
});

app.get('/user', async (req, res) => {
  const guildId = req.query.guild ? req.query.guild.toString() : null;
  const userId = req.query.user ? req.query.user.toString() : null;
  if (guildId === null || userId === null) {
    res.sendStatus(400);
    return;
  }
  const hoursStr = req.query.hours ? req.query.hours.toString() : DEFAULT_LOOKBACK;
  let hours: number;
  try {
    hours = parseInt(hoursStr);
  } catch (err) {
    res.sendStatus(400);
    return;
  }
  const data = await getSingleUserDataByServerAndLookback(guildId, userId, hours);
  res.send(data);
});

// clear any entries before we listen for new logs
removeAllUserEntries().then((_resp) => {
  app.listen(PORT);
  console.log('Listening on port:', PORT);

  // periodically compile log data
  setInterval(processRawLogs, 1000 * 60);
});
