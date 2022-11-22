export type OverallData = {
  day: string;
  time: number;
};

export type UserTimeSummary = {
  id: string; // user id
  time: number; // minutes for the lookback
};

export type DiscordUserSummary = {
  id: string;
  username: string;
  icon: string;
};

export type DiscordUserTimeSummary = UserTimeSummary & DiscordUserSummary;
