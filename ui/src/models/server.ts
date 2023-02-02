export type DataPoint = {
  day: string;
  time: number;
};

export type TotalServerData = {
  total: number; // total number of Person-Minutes
  data: DataPoint[];
};

export type UserTimeSummary = {
  userId: string; // user id
  time: number; // minutes for the lookback
};

export type DiscordUserSummary = {
  id: string;
  username: string;
  icon: string;
};

export type DiscordUserTimeSummary = UserTimeSummary & DiscordUserSummary;
