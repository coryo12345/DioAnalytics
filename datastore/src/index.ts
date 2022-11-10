import express from 'express';
import { addUserEntry } from './db';

const PORT = 3000;

const app = express();

app.get('/', function (req, res) {
  const guildId = req.query.guild.toString();
  const userId = req.query.user.toString();
  const now = new Date().toISOString();
  console.log(guildId, userId, now);
  addUserEntry(guildId, userId, now);
  res.send('Hello World');
});

app.listen(PORT);

// listen for incoming requests to log data

// preiodically re-compile overall data
