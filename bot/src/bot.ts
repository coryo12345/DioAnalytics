import { Client, GatewayIntentBits, Guild } from 'discord.js';

const LOG_TIMEOUT = 1000 * 5;

export function startBot(botToken: string, timelogURL: string) {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'timelogs') {
      await interaction.reply({ content: timelogURL });
    }
  });

  client.login(botToken);

  setInterval(() => {
    logTimeForAllServers(client);
  }, LOG_TIMEOUT);
}

async function logTimeForAllServers(client: Client) {
  const guildManager = client.guilds;
  await guildManager.fetch();
  guildManager.cache.forEach((guild) => {
    logTimeForServer(guild);
  });
}

async function logTimeForServer(guild: Guild) {
  const channelManager = guild.channels;
  await channelManager.fetch();
  channelManager.cache
    .filter((chan) => chan.isVoiceBased())
    .forEach(async (channel) => {
      try {
        await channel.fetch();
      } catch (err) {
        return;
      }
      console.log(`${guild.name} ${channel.name} `, channel.members);
    });
}
