-- Revert CadO:02-seeding from pg

BEGIN;

TRUNCATE "user", "event", "draw", "event_user";

COMMIT;
