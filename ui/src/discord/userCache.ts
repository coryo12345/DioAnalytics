import { Client, Partials } from 'discord.js';
import type { DiscordUser } from '../models/discord';

const client = new Client({ intents: ['GuildMembers'], partials: [Partials.User, Partials.GuildMember] });
client.login(import.meta.env.DISCORD_BOT_TOKEN);

export const getUserDetailsFromCache = newCachedUserGetter();

function newCachedUserGetter() {
  const CACHE_DURATION = 1000 * 60 * 5; // 5 min in ms
  const cachedUsers = new Map<string, DiscordUser>();
  const cachedTime = new Map<string, number>();

  return async (userId: string) => {
    let user = cachedUsers.get(userId);
    const lastTime = cachedTime.get(userId);
    const now = new Date().getTime();
    if (user && lastTime && lastTime > now - CACHE_DURATION) {
      return user;
    }
    // fetch user details
    try {
      const fullUser = await client.users.fetch(userId);
      user = {
        id: fullUser.id,
        username: fullUser.username,
        discriminator: fullUser.discriminator,
        icon: fullUser.avatarURL() || '',
      };
    } catch (err) {
      return {
        id: userId,
        username: '',
        discriminator: '',
        icon: '',
      };
    }

    cachedUsers.set(userId, user);
    cachedTime.set(userId, new Date().getTime());
    return user;
  };
}
