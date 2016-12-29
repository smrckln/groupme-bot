--
-- File generated with SQLiteStudio v3.1.1 on Wed Dec 28 23:20:29 2016
--
-- Text encoding used: UTF-8
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: messages
DROP TABLE IF EXISTS messages;

CREATE TABLE messages (
    message TEXT    NOT NULL
                    DEFAULT (''),
    user_id INTEGER REFERENCES users (user_id) 
                    DEFAULT ( -1),
    id      INTEGER PRIMARY KEY AUTOINCREMENT
                    DEFAULT ( -1) 
);


-- Table: users
DROP TABLE IF EXISTS users;

CREATE TABLE users (
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
DROP TABLE IF EXISTS words;

CREATE TABLE words (
    id      INTEGER PRIMARY KEY AUTOINCREMENT
                    DEFAULT ( -1),
    user_id STRING  REFERENCES users (user_id) 
                    NOT NULL
                    DEFAULT ( -1),
    word    STRING  NOT NULL
);


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
