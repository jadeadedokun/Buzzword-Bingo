const sqlite3 = require("sqlite3").verbose();

const scoresDB = new sqlite3.Database("scores.db");
const wordsDB = new sqlite3.Database("words.db");


function listTopPlayers() {
    scoresDB.all("SELECT nickname, time FROM scores ORDER BY time ASC LIMIT 5", (err, rows) => {
        rows.forEach((row) => console.log(`${row.nickname}, ${row.time}`));
        scoresDB.close();
    });
}

function listTopWords() {
    wordsDB.all("SELECT word, count FROM words ORDER BY count DESC LIMIT 5", (err, rows) => {
        rows.forEach((row) => console.log(`${row.word}, ${row.count}`));
        wordsDB.close();
    });
}
