import { Client, Collection, GatewayIntentBits, Guild, GuildMember } from 'discord.js';
import axios from 'axios';

const LOG_TIMEOUT = 1000 * 50; // this should be at least once a minute

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
      (channel.members as Collection<string, GuildMember>).forEach((member, id) => {
        console.log(`${guild.name} ${channel.name} ${id} ${member.user.username}#${member.user.discriminator}`);
        // send this log to the datastore service
        axios.get(`http://localhost:3000?guild=${guild.id}&user=${id}`);
      });
    });
}
