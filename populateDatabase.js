const { Client } = require("pg");

// Database connection
const client = new Client({
    user: "your_user",
    host: "localhost",
    database: "your_database",
    password: "your_password",
    port: 5432
});
client.connect();

// Function to update word count directly in PostgreSQL
function updateWordClick(word) {
    client.query(
        "INSERT INTO words (word, count) VALUES ($1, 1) ON CONFLICT (word) DO UPDATE SET count = words.count + 1",
        [word],
        (err) => {
            if (err) console.error("Error updating word:", err);
        }
    );
}

function submitScore(player, time) {
  client.query(
      "INSERT INTO scores (player, time) VALUES ($1, $2)",
      [player, time],
      (err) => {
          if (err) console.error("Error submitting score:", err);
      }
  );
}
