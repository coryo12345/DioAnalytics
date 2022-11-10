export const INSERT_RAW_LOG = 'INSERT INTO logs_raw VALUES (?, ?, ?)';

// This only works if the recompile time is >= 1 min.
// As in, recompiles must be at least 1 min apart
export const PROCESS_RAW_LOGS = `
BEGIN;

CREATE TEMP TABLE temp.user_time_by_hour_temp AS
WITH entries AS (
SELECT DISTINCT
		guildId,
		userId,
		date(clocked_time) day, 
		strftime('%H', clocked_time) hour,
		strftime('%M', clocked_time) minute
FROM
		logs_raw
)
SELECT 
		e.guildId,
		e.userId,
		e.day,
		e.hour,
		count(e.minute) + coalesce(utbh.total_minutes, 0) as total_minutes
FROM 
		entries e
LEFT JOIN
		user_time_by_hour utbh 
		ON utbh.guildId = e.guildId
		AND utbh.userId = e.userId
		AND utbh.day = e.day
		AND utbh.hour = e.hour
GROUP BY
		e.guildId,
		e.userId,
		e.day,
		e.hour
;

DELETE FROM 
		user_time_by_hour
WHERE EXISTS (
	select 
			1
	from 
			temp.user_time_by_hour_temp t
	where 
			t.guildId = user_time_by_hour.guildId 
			and t.userId = user_time_by_hour.userId 
			and t.hour = user_time_by_hour.hour 
			and t.day = user_time_by_hour.day
);

INSERT INTO user_time_by_hour SELECT * FROM temp.user_time_by_hour_temp;

DROP TABLE temp.user_time_by_hour_temp;

DELETE FROM logs_raw;

END;
`;
