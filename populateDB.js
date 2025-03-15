const sqlite3 = require("sqlite3").verbose();

const scoresDB = new sqlite3.Database("scores.db");
const wordsDB = new sqlite3.Database("words.db");

function insertScore(player, time) {
    scoresDB.run("INSERT INTO scores (player, time) VALUES (?, ?)", [nickname, time]);
}

function updateWordClick(word) {
    wordsDB.run(
        `INSERT INTO words (word, count) VALUES (?, 1)
         ON CONFLICT(word) DO UPDATE SET count = count + 1`,
        [word]
    );
}

setTimeout(() => {
    scoresDB.close();
    wordsDB.close();
}, 2000);
