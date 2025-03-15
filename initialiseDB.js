const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

// Function to delete and recreate a database
function initialiseDatabase(dbFile, schemaFile) {
    if (fs.existsSync(dbFile)) {
        fs.unlinkSync(dbFile); // Delete the existing database file
    }

    const db = new sqlite3.Database(dbFile, (err) => {
        if (err) {
            console.error("Error opening database:", err.message);
        } else {
            console.log(`${dbFile} created successfully.`);
        }
    });

    // Read schema file and execute SQL commands
    const schemaSQL = fs.readFileSync(schemaFile, "utf8");
    db.exec(schemaSQL, (err) => {
        if (err) {
            console.error("Error executing schema:", err.message);
        } else {
            console.log(`${dbFile} initialized with tables.`);
        }
        db.close();
    });
}

// Initialise `scores.db`
initialiseDatabase("scores.db", "scores.sql");

// Initialise `words.db`
initialiseDatabase("words.db", "words.sql");
