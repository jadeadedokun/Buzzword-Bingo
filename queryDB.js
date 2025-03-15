const sqlite3 = require("sqlite3").verbose();

// Open SQLite databases
const scoresDB = new sqlite3.Database("scores.db");
const wordsDB = new sqlite3.Database("words.db");

// Get command-line arguments
const args = process.argv.slice(2);

if (args.length < 1) {
    console.log("Please provide 1 to get top players or 2 to get top words.");
    process.exit(1);
}

const queryNumber = parseInt(args[0]);

// Switch case to call the appropriate function
switch (queryNumber) {
    case 1:
        listTopPlayers();
        break;
    case 2:
        listTopWords();
        break;
    default:
        console.log("Invalid option. Use 1 for top players or 2 for top words.");
        process.exit(1);
}

// 🏆 1️⃣ Get Top 5 Fastest Players
function listTopPlayers() {
    scoresDB.all("SELECT player, time FROM scores ORDER BY time ASC LIMIT 5", (err, rows) => {
        if (err) return console.error(err.message);
        console.log("\n🏆 Top 5 Fastest Players:");
        rows.forEach((row, index) => console.log(`${index + 1}. ${row.player} - ${row.time}s`));
        scoresDB.close();
    });
}

// 🔥 2️⃣ Get Top 5 Most Clicked Words
function listTopWords() {
    wordsDB.all("SELECT word, count FROM words ORDER BY count DESC LIMIT 5", (err, rows) => {
        if (err) return console.error(err.message);
        rows.forEach((row, index) => console.log(`${index + 1}. ${row.word} - ${row.count} clicks`));
        wordsDB.close();
    });
}
