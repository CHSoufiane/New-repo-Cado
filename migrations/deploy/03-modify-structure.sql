-- Deploy CadO:03-modify-structure to pg

BEGIN;

ALTER TABLE "event_user"
    ADD COLUMN "created_at" TIMESTAMP DEFAULT NOW(),
    ADD COLUMN "updated_at" TIMESTAMP;

COMMIT;
