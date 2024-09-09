-- Verify CadO:02-seeding on pg

BEGIN;

SELECT * FROM "user" WHERE id = 1;
SELECT * FROM "event" WHERE id = 1;
SELECT * FROM "draw" WHERE id = 1;
SELECT * FROM "event_user" WHERE id = 1;

ROLLBACK;
