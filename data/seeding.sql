BEGIN;

INSERT INTO
    "user" ("name", "email", "password", "is_registered", "token")
VALUES
    ('Yanis', 'yanis@gnail.com', '123456', true, 'lmknfzkffzfz'),
    ('Anais', 'anais@gnail.com', '654321', true, 'mliuzrhzrzr'),
    ('Yoann', 'yoann@gnail.com', null, false, 'pzdojozdd'),
    ('Estelle', 'estelle@gnail.com', null, false, 'ppalslnekee');

INSERT INTO
    "event" ("name", "date", "organizer_id")
VALUES
    ('Anniversaire en groupe', '2024-06-20', 2);

INSERT INTO
    "draw" ("giver_id", "receiver_id", "event_id")
VALUES
    (1, 3, 1),
    (2, 4, 1),
    (3, 2, 1),
    (4, 1, 1);

INSERT INTO
    "event_user" ("event_id", "user_id")
VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4);


COMMIT;