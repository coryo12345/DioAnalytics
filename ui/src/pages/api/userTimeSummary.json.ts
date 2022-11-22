import type { APIRoute } from 'astro';

export const get: APIRoute = ({ params, request }) => {
  // fetch data from datastore
  const data: any[] = [];

  return {
    body: JSON.stringify(data),
  };
};

// TODO: -- map ids to user info

// import type { DiscordUser } from '../../models/discord';

// const getUserDetails = newCachedUserGetter();

// function newCachedUserGetter() {
//   const CACHE_DURATION = 1000 * 60 * 5; // 5 min in ms
//   const cachedUsers = new Map<string, DiscordUser>();
//   const cachedTime = new Map<string, number>();

//   return async (userId: string) => {
//     let user = cachedUsers.get(userId);
//     const lastTime = cachedTime.get(userId);
//     const now = new Date().getTime();
//     if (user && lastTime && lastTime > now - CACHE_DURATION) return user;
//     // fetch user details
//     const fullUser = await client.users.get(userId);
//     user = {
//       id: userId,
//       username: '',
//       discriminator: '',
//       icon: '',
//     };
//     cachedUsers.set(userId, user);
//     cachedTime.set(userId, new Date().getTime());
//     return user;
//   };
// }
