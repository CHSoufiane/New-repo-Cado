-- Verify cado:create-table on pg

BEGIN;

SELECT * FROM "user" WHERE false;
SELECT * FROM "event" WHERE false;
SELECT * FROM "draw" WHERE FALSE;
SELECT * FROM "event_user" WHERE FALSE;


ROLLBACK;
