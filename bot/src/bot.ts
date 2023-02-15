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
    } else if (interaction.commandName === 'optout') {
      optOut(interaction.user.id);
      interaction.reply({ content: `You have been opted out` });
    } else if (interaction.commandName === 'optin') {
      optIn(interaction.user.id);
      interaction.reply({ content: `You have been opted back in` });
    }
  });

  client.login(botToken);

  client.on('voiceStateUpdate', handleVoiceStateUpdate);

  findInitialState(client);

  setInterval(heartbeat, 1000 * 60);
}

async function heartbeat() {
  axios.get(`${DATASTORE_URL}/log/heartbeat`);
}

function handleVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
  const oldId = oldState.channelId !== oldState.guild.afkChannelId ? oldState.channelId : null;
  const newId = newState.channelId !== newState.guild.afkChannelId ? newState.channelId : null;
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

async function findInitialState(client: Client) {
  const guilds = await client.guilds.fetch();
  guilds.forEach(async (_guild) => {
    const guild = await _guild.fetch();
    const channels = await guild.channels.fetch();
    channels
      .filter((chan) => chan.isVoiceBased() && chan.id !== guild.afkChannelId)
      .forEach(async (_chan) => {
        try {
          const chan = await _chan.fetch();
          chan.members.forEach((member) => {
            logUserJoined(member.id, guild.id);
          });
        } catch (err) {
          // if the bot doesn't have permission to a channel - just ignore
        }
      });
  });
}

async function optOut(userId: string) {
  axios.post(`${DATASTORE_URL}/log/optOut?user=${userId}`);
}

async function optIn(userId: string) {
  axios.post(`${DATASTORE_URL}/log/optIn?user=${userId}`);
}
