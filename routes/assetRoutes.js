const express = require("express");
const router = express.Router();

// GET request to display the asset issuance form
router.get("/issue", async (req, res) => {
  const pool = req.app.locals.pool;
  // PostgreSQL pool object

  try {
    const { rows } = await pool.query("SELECT * FROM asset_logs");
    res.render("issueAsset", { logs: rows });
  } catch (error) {
    console.error(error);
    res.render("issueAsset", { logs: [] });
  }
});

// POST request to handle asset issuance
router.post("/issue", async (req, res) => {
  const { employeeName, assetId, comments } = req.body;
  const pool = req.app.locals.pool;

  try {
    await pool.query(
      "INSERT INTO asset_logs (employee_name, asset_id, comments) VALUES ($1, $2, $3)",
      [employeeName, assetId, comments]
    );
    res.redirect("/assets/issue");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error inserting data");
  }
});

// GET request to display the asset issuance form
router.get("/return", async (req, res) => {
  const pool = req.app.locals.pool;
  try {
    const { rows } = await pool.query("SELECT * FROM asset_logs1");
    res.render("returnAsset", { logs: rows });
  } catch (error) {
    console.error(error);
    res.render("returnAsset", { logs: [] });
  }
});

// POST request to handle asset issuance
router.post("/return", async (req, res) => {
  const { employeeName, assetId, comments } = req.body;
  const pool = req.app.locals.pool;

  try {
    await pool.query(
      "INSERT INTO asset_logs1 (employee_name, asset_id, comments) VALUES ($1, $2, $3)",
      [employeeName, assetId, comments]
    );
    console.log("Received POST request with:", req.body);
    res.redirect("/assets/return");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error inserting data");
  }
});

// GET request to display the asset issuance form
router.get("/scrap", async (req, res) => {
  const pool = req.app.locals.pool;

  try {
    const { rows } = await pool.query("SELECT * FROM asset_logs2");
    res.render("scrapAsset", { logs: rows });
  } catch (error) {
    console.error(error);
    res.render("scrapAsset", { logs: [] });
  }
});

// POST request to handle asset issuance
router.post("/scrap", async (req, res) => {
  const { employeeName, assetId, comments } = req.body;
  const pool = req.app.locals.pool;

  try {
    await pool.query(
      "INSERT INTO asset_logs2 (employee_name, asset_id, comments) VALUES ($1, $2, $3)",
      [employeeName, assetId, comments]
    );
    console.log("Received POST request with:", req.body);
    res.redirect("/assets/scrap");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error inserting data");
  }
});
module.exports = router;
