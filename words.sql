CREATE TABLE words (
    id SERIAL PRIMARY KEY,
    word VARCHAR(255) UNIQUE,  -- Ensures each word is stored once
    count INT DEFAULT 1
);