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