--  Property name           Data type       Additional keywords

CREATE TABLE profiles (
    id                      INTEGER         PRIMARY KEY NOT NULL,
    name                    TEXT            NOT NULL,
    token                   TEXT            NOT NULL,
    secret                  TEXT            NOT NULL,
    createdAt               INTEGER         NOT NULL,
    editedAt                INTEGER
);

CREATE TABLE notes (
    id                      INTEGER         PRIMARY KEY NOT NULL,
    domain                  TEXT            NOT NULL,
    text                    TEXT            NOT NULL
);

CREATE TABLE tags (
    id                      INTEGER         PRIMARY KEY NOT NULL,
    name                    TEXT            NOT NULL,
    color                   TEXT            NOT NULL
);

CREATE TABLE domainTagRelations (
    id                      INTEGER         PRIMARY KEY NOT NULL,
    domain                  TEXT            NOT NULL,
    tagId                   INTEGER         NOT NULL,

    FOREIGN KEY (tagId) REFERENCES tags
);