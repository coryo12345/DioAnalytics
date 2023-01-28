export const INSERT_RAW_LOG = 'INSERT INTO logs_raw VALUES (?, ?, ?)';

export const REMOVE_RAW_LOG = 'DELETE FROM logs_raw WHERE guildId = ? and userId = ?;';

export const PROCESS_RAW_LOGS = `
BEGIN;

-- add 1 minute to entries for users we already have for the current hour
with rows_to_update as (
	select 
			utbh.*
	from
			user_time_by_hour utbh,
			logs_raw lr
	where
			utbh.guildId = lr.guildId 
			and utbh.userId = lr.userId 
			and utbh.day = date('now')
			and utbh.hour = strftime('%H', datetime('now'))
)
update user_time_by_hour 
set total_minutes = user_time_by_hour.total_minutes + 1
from rows_to_update rtu
where 
		user_time_by_hour.guildId = rtu.guildId
		and user_time_by_hour.userId = rtu.userId
		and user_time_by_hour.day = rtu.day
		and user_time_by_hour.hour = rtu.hour
;

-- add entries with 1 minute for the current hour for users we don't have records for (in the current hour)
with records_to_add as (
	select
			lr.guildId,
			lr.userId,
			date('now') day,
			cast(strftime('%H', datetime('now')) as int) hour,
			1
	from
			logs_raw lr
	left outer join
			user_time_by_hour utbh 
			on utbh.guildId = lr.guildId 
			and utbh.userId = lr.userId 
			and utbh."day"  = date('now')
			and utbh."hour" = strftime('%H', datetime('now'))
	where
			utbh.guildId is null

)
insert into user_time_by_hour 
select * from records_to_add;

END;
`;

export const TIME_BY_SERVER = `
SELECT
		day,
		hour,
		sum(total_minutes) time
FROM
		user_time_by_hour
WHERE
		guildId = ?
		AND day > datetime('now', ?)
GROUP BY
		day,
		hour
;
`;

export const TIME_PER_USER = `
SELECT
		cast(userId as TEXT) userId,
		sum(total_minutes) time
FROM
		user_time_by_hour
WHERE
		guildId = ?
		AND day > datetime('now', ?)
GROUP BY
		userId
;
`;
