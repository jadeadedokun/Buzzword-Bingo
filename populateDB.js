const sqlite3 = require("sqlite3").verbose();

// Open both databases
const scoresDB = new sqlite3.Database("scores.db");
const wordsDB = new sqlite3.Database("words.db");

// 🟢 Function to update word count in `words.db`
function updateWordClick(word) {
    wordsDB.run(
        `INSERT INTO words (word, count) VALUES (?, 1)
         ON CONFLICT(word) DO UPDATE SET count = count + 1`,
        [word],
        (err) => {
            if (err) console.error("Error updating word:", err.message);
        }
    );
}

// 🏆 Function to save a player's score in `scores.db`
function submitScore(player, time) {
    scoresDB.run(
        "INSERT INTO scores (player, time) VALUES (?, ?)",
        [player, time],
        (err) => {
            if (err) console.error("Error inserting score:", err.message);
        }
    );
}

console.log("Database populated!");

// Close the database connections
scoresDB.close();
wordsDB.close();
