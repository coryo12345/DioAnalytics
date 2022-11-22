import express from 'express';
import { addUserEntry, getServerDataByLookback, getUserDataByServerAndLookback, processRawLogs } from './db';

const PORT = 3001;
const RECOMPILE_INTERVAL = 1000 * 60;

const app = express();
app.use(express.json());

app.post('/log', (req, res) => {
  const guildId = req.query.guild ? req.query.guild.toString() : null;
  const userId = req.query.user ? req.query.user.toString() : null;
  if (guildId === null || userId === null) {
    res.sendStatus(400);
    return;
  }
  const now = new Date().toISOString();
  console.log(guildId, userId, now);
  addUserEntry(guildId, userId, now);
  res.send({});
});

app.get('/server', async (req, res) => {
  const guildId = req.query.guild ? req.query.guild.toString() : null;
  if (guildId === null) {
    res.sendStatus(400);
    return;
  }
  const daysStr = req.query.days ? req.query.days.toString() : '7';
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
  const daysStr = req.query.days ? req.query.days.toString() : '7';
  let days: number;
  try {
    days = parseInt(daysStr);
  } catch (err) {
    res.sendStatus(400);
    return;
  }
  const data = await getUserDataByServerAndLookback(guildId, days);
  res.send(data);
});

app.listen(PORT);
console.log('Listening on port:', PORT);

// periodically compile log data
setInterval(processRawLogs, RECOMPILE_INTERVAL);
