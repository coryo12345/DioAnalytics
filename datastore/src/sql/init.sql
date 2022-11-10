PRAGMA journal_mode=WAL;

CREATE TABLE IF NOT EXISTS logs_raw (
    guildId STRING,
    userId STRING,
    clocked_time TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_time_by_hour (
    guildId STRING,
    userId STRING,
    day DATE,
    hour INT,
    total_minutes INT
);
