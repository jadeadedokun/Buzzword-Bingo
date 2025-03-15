const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

function initialiseDatabase(dbFile, schemaFile) {
    if (fs.existsSync(dbFile)) {
        fs.unlinkSync(dbFile);
    }

    const db = new sqlite3.Database(dbFile);

    const schemaSQL = fs.readFileSync(schemaFile, "utf8");

    db.serialize(() => {
        db.exec(schemaSQL, () => {
            db.close();
        });
    });
}

initialiseDatabase("scores.db", "scores.sql");
initialiseDatabase("words.db", "words.sql");
