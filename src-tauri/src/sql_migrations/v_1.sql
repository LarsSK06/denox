CREATE TABLE profiles (
    id                      INTEGER         PRIMARY KEY NOT NULL,
    name                    TEXT            NOT NULL,
    isPasswordProtected     INTEGER         NOT NULL,
    token                   TEXT            NOT NULL,
    secret                  TEXT            NOT NULL,
    createdAt               INTEGER         NOT NULL,
    editedAt                INTEGER
);