

DROP TABLE IF EXISTS "user", "event", "draw", "event_user";

CREATE TABLE "user" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR,
    "is_registered" BOOLEAN NOT NULL DEFAULT FALSE,
    "token" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "event" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" VARCHAR NOT NULL,
    "date" DATE NOT NULL,
    "organizer_id" INTEGER NOT NULL REFERENCES "user"("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);


CREATE TABLE "draw" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "event_id" INTEGER NOT NULL REFERENCES "event"("id"),
    "giver_id" INTEGER NOT NULL REFERENCES "user"("id"),
    "receiver_id" INTEGER NOT NULL REFERENCES "user"("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "event_user" (
    "event_id" INTEGER NOT NULL REFERENCES "event"("id") ON DELETE CASCADE,
    "user_id" INTEGER NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ,
    PRIMARY KEY ("event_id", "user_id")
);

ALTER SEQUENCE "user_id_seq" RESTART WITH 1;
ALTER SEQUENCE "event_id_seq" RESTART WITH 1;
ALTER SEQUENCE "draw_id_seq" RESTART WITH 1;
