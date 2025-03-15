const pool = require("./database");

async function addGame(player, time) {
  await pool.query("INSERT INTO games (player, time) VALUES ($1, $2)", [player, time]);
  console.log("Game result added!"); // Delete this line
}

addGame("Alice", 35);

async function updateBuzzword(word) {
    await pool.query(
      "INSERT INTO clicks (word, count) VALUES ($1, 1) ON CONFLICT (word) DO UPDATE SET count = clicks.count + 1", [word]);
    console.log(`${word} updated!`);  // Delete this line
  }
  
  updateBuzzword("AI");
  