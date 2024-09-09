-- Revert CadO:03-modify-structure from pg

BEGIN;

ALTER TABLE "event_user"
    DROP COLUMN "created_at",
    DROP COLUMN "updated_at";

COMMIT;
