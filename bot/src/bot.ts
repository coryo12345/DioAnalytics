import { Client, GatewayIntentBits, VoiceState } from 'discord.js';
import axios from 'axios';

let DATASTORE_URL: string;

export function startBot(botToken: string, timelogURL: string, datastore_url: string) {
  DATASTORE_URL = datastore_url;

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildVoiceStates,
    ],
  });

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'timelogs') {
      const serverId = interaction.guildId;
      await interaction.reply({ content: `${timelogURL}/server?id=${serverId}` });
    }
  });

  client.login(botToken);

  client.on('voiceStateUpdate', handleVoiceStateUpdate);
}

function handleVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
  const oldId = oldState.channelId;
  const newId = newState.channelId;
  if (oldId === null && newId !== null) {
    logUserJoined(newState.id, newState.guild.id);
  } else if (oldId !== null && newId === null) {
    logUserLeft(oldState.id, oldState.guild.id);
  }
}

function logUserJoined(userId: string, guildId: string) {
  axios.post(`${DATASTORE_URL}/log/join?guild=${guildId}&user=${userId}`);
}

function logUserLeft(userId: string, guildId: string) {
  axios.post(`${DATASTORE_URL}/log/exit?guild=${guildId}&user=${userId}`);
}
