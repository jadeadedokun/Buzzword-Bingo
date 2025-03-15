app.post("/add-game", async (req, res) => {
  const { player, time } = req.body;
  await pool.query("INSERT INTO games (player, time) VALUES ($1, $2)", [player, time]);
  res.send("Game added!"); // Delete this
});

app.post("/click-word", async (req, res) => {
  const { word } = req.body;
  await pool.query(
    "INSERT INTO clicks (word, count) VALUES ($1, 1) ON CONFLICT (word) DO UPDATE SET count = clicks.count + 1",
    [word]
  );
  res.send("Word click updated!"); // Delete this
});

// leaderboard
app.get("/leaderboard/times", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT player, time FROM games ORDER BY time ASC LIMIT 5"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/leaderboard/words", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT word, count FROM clicks ORDER BY count DESC LIMIT 5"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
