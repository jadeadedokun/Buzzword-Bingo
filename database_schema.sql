CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    player VARCHAR(255),
    time INT  -- Time in seconds
);

CREATE TABLE clicks (
    id SERIAL PRIMARY KEY,
    word VARCHAR(255) UNIQUE,  -- Ensures each word is stored once
    count INT DEFAULT 1
);
