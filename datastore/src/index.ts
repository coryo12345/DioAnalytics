import express from 'express';
import {
  addUserEntry,
  getServerDataByLookback,
  getSingleUserDataByServerAndLookback,
  getUsersDataByServerAndLookback,
  processRawLogs,
  removeUserEntry,
} from './db';

const PORT = 3001;
const DEFAULT_LOOKBACK = '7';

const app = express();
app.use(express.json());

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
  const daysStr = req.query.days ? req.query.days.toString() : DEFAULT_LOOKBACK;
  let days: number;
  try {
    days = parseInt(daysStr);
  } catch (err) {
    res.sendStatus(400);
    return;
  }
  const data = await getServerDataByLookback(guildId, days);
  res.send(data);
});

app.get('/users', async (req, res) => {
  const guildId = req.query.guild ? req.query.guild.toString() : null;
  if (guildId === null) {
    res.sendStatus(400);
    return;
  }
  const daysStr = req.query.days ? req.query.days.toString() : DEFAULT_LOOKBACK;
  let days: number;
  try {
    days = parseInt(daysStr);
  } catch (err) {
    res.sendStatus(400);
    return;
  }
  const data = await getUsersDataByServerAndLookback(guildId, days);
  res.send(data);
});

app.get('/user', async (req, res) => {
  const guildId = req.query.guild ? req.query.guild.toString() : null;
  const userId = req.query.user ? req.query.user.toString() : null;
  if (guildId === null || userId === null) {
    res.sendStatus(400);
    return;
  }
  const daysStr = req.query.days ? req.query.days.toString() : DEFAULT_LOOKBACK;
  let days: number;
  try {
    days = parseInt(daysStr);
  } catch (err) {
    res.sendStatus(400);
    return;
  }
  const data = await getSingleUserDataByServerAndLookback(guildId, userId, days);
  res.send(data);
});

app.listen(PORT);
console.log('Listening on port:', PORT);

// periodically compile log data
setInterval(processRawLogs, 1000 * 60);
