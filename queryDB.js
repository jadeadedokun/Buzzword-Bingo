const sqlite3 = require("sqlite3").verbose();

const scoresDB = new sqlite3.Database("scores.db");
const wordsDB = new sqlite3.Database("words.db");

const args = process.argv.slice(2);

if (args.length < 1) {
    process.exit(1);
}

const queryNumber = parseInt(args[0]);

switch (queryNumber) {
    case 1:
        listTopPlayers();
        break;
    case 2:
        listTopWords();
        break;
    default:
        process.exit(1);
}

function listTopPlayers() {
    scoresDB.all("SELECT player, time FROM scores ORDER BY time ASC LIMIT 5", (err, rows) => {
        rows.forEach((row) => console.log(`${row.player}, ${row.time}`));
        scoresDB.close();
    });
}

function listTopWords() {
    wordsDB.all("SELECT word, count FROM words ORDER BY count DESC LIMIT 5", (err, rows) => {
        rows.forEach((row) => console.log(`${row.word}, ${row.count}`));
        wordsDB.close();
    });
}
