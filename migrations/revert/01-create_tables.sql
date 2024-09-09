-- Revert cado:create-table from pg

BEGIN;

DROP TABLE "user", "event", "draw", "event_user";


COMMIT;
