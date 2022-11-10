import express from 'express';
import { addUserEntry, processRawLogs } from './db';

const PORT = 3000;
const RECOMPILE_INTERVAL = 1000 * 60;

const app = express();
app.use(express.json());

app.get('/', function (req, res) {
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

app.listen(PORT);

// periodically compile log data
setInterval(processRawLogs, RECOMPILE_INTERVAL);
