import type { GuildInfo } from './../models/discord';
import { Client, GuildPreview } from 'discord.js';

const CACHE_DURATION = 1000 * 60 * 5; // 5 min in ms

const client = new Client({ intents: [] });
const token = import.meta.env.DISCORD_BOT_TOKEN ?? process.env.DISCORD_BOT_TOKEN;
client.login(token);

export const getServerInfoFromCache = newCachedServerGetter();

/**
 * closure based cache for server info
 */
function newCachedServerGetter(): (guildId: string) => Promise<GuildInfo | null> {
  const cachedServers = new Map<string, GuildInfo>();
  const cachedTime = new Map<string, number>();

  return async (guildId: string): Promise<GuildInfo | null> => {
    let guild = cachedServers.get(guildId);
    const lastTime = cachedTime.get(guildId);
    const now = new Date().getTime();
    if (guild && lastTime && lastTime > now - CACHE_DURATION) {
      return guild;
    }

    // fetch server details
    try {
      const fullGuildPreview: GuildPreview = await client.fetchGuildPreview(guildId);
      guild = {
        name: fullGuildPreview.name,
        icon: fullGuildPreview.iconURL() || '',
      };
    } catch (err) {
      return null;
    }

    cachedServers.set(guildId, guild);
    cachedTime.set(guildId, new Date().getTime());
    return guild;
  };
}
