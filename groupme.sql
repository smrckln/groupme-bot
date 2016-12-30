--
-- File generated with SQLiteStudio v3.1.1 on Wed Dec 28 23:20:29 2016
--
-- Text encoding used: UTF-8
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: messages

CREATE TABLE IF NOT EXISTS `messages` (
    message TEXT    NOT NULL
                    DEFAULT (''),
    user_id INTEGER REFERENCES users (user_id)
                    DEFAULT ( -1),
    id      INTEGER PRIMARY KEY AUTOINCREMENT
                    DEFAULT ( -1)
);


-- Table: users

CREATE TABLE IF NOT EXISTS `users` (
    id      INTEGER PRIMARY KEY AUTOINCREMENT
                    NOT NULL
                    DEFAULT ( -1),
    user_id STRING  UNIQUE
                    NOT NULL
                    DEFAULT ( -1),
    name    STRING  UNIQUE
                    NOT NULL
);


-- Table: words

CREATE TABLE IF NOT EXISTS `words` (
    id      INTEGER PRIMARY KEY AUTOINCREMENT
                    DEFAULT ( -1),
    user_id STRING  REFERENCES users (user_id)
                    NOT NULL
                    DEFAULT ( -1),
    word    STRING  NOT NULL
);


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
