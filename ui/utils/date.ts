import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

const current_tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function convertToNow(utcDate: string) {
  // dayjs will convert this to the current timezone
  return dayjs(utcDate).format('YYYY-MM-DDTHH:mm:ss') + 'Z';
}

export function prettyDate(date: string) {
  return dayjs(date).toString();
}
