const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors()); // Enable frontend requests
app.use(express.json());

const scoresDB = new sqlite3.Database("scores.db");
const wordsDB = new sqlite3.Database("words.db");

// API to get the top 5 fastest winning times
app.get("/top-players", (req, res) => {
    scoresDB.all("SELECT nickname, time FROM scores ORDER BY time ASC LIMIT 5", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// API to get the top 5 most clicked words
app.get("/top-words", (req, res) => {
    wordsDB.all("SELECT word, count FROM words ORDER BY count DESC LIMIT 5", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});