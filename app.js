const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const app = express();
const assetRoutes = require("./routes/assetRoutes");

// Database connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "users_db",
  password: "abcd",
  port: 5432,
});

// Set the view engine and static files
app.set("view engine", "pug");
app.use(express.json()); // For parsing JSON data
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Redirect root ("/") to login
app.get("/", (req, res) => res.redirect("/login"));

// Render login page
app.get("/login", (req, res) => {
  res.render("login");
});

// About Page Route
app.get("/about", (req, res) => {
  res.render("about");
});

// Handle login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );
    if (result.rows.length > 0) {
      res.redirect("/about");
    } else {
      res.send(`
        <script>
          alert('Invalid username or password.');
          window.location.href = '/login';
        </script>
      `);
    }
  } catch (err) {
    console.error(err);
    res.send("Error during login.");
  }
});

// Render registration page
app.get("/register", (req, res) => {
  res.render("register");
});

// Handle registration
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      username,
      password,
    ]);
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.send("Error during registration.");
  }
});

app.get("/employeeMaster", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employees");
    const employees = result.rows;
    res.render("employeeMaster", { employees });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching employees");
  }
});

// Sidebar menu routes
app.get("/employeeMaster", (req, res) => res.render("employeeMaster"));
app.get("/assetMaster", (req, res) => res.render("assetMaster"));
app.get("/assetCategoryMaster", (req, res) =>
  res.render("assetCategoryMaster")
);
app.get("/stockView", (req, res) => res.render("assetMaster"));
app.get("/issueAsset", (req, res) => res.render("issueAsset"));
app.get("/returnAsset", (req, res) => res.render("returnAsset"));
app.get("/scrapAsset", (req, res) => res.render("scrapAsset"));
app.get("/assetHistory", (req, res) => res.render("assetMaster"));

// About Page Route
app.get("/about", (req, res) => res.render("about"));

// Logout
app.get("/logout", (req, res) => res.redirect("/login"));

// Get all employees
app.get("/employees", async (req, res) => {
  const { search } = req.query;
  try {
    const query = search
      ? `SELECT * FROM employees WHERE name ILIKE $1 OR email ILIKE $1`
      : `SELECT * FROM employees`;
    const params = search ? [`%${search}%`] : [];
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// Get single employee
app.get("/employees/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM employees WHERE id = $1", [
      id,
    ]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch employee" });
  }
});

// Add new employee
app.post("/employees", async (req, res) => {
  const { name, email, status } = req.body;

  try {
    // Check if email already exists in the database
    const result = await pool.query(
      "SELECT * FROM employees WHERE email = $1",
      [email]
    );
    if (result.rows.length > 0) {
      return res.status(400).send("Employee with this email already exists.");
    }
    const { rows } = await pool.query(
      "INSERT INTO employees (name, email, status) VALUES ($1, $2, $3) RETURNING *",
      [name, email, status]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add employee" });
  }
});

// Add new employee
app.post("/employees", async (req, res) => {
  const { name, email, status } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM employees WHERE email = $1",
      [email]
    );
    if (result.rows.length > 0) {
      return res.status(400).send("Employee with this email already exists.");
    }
    const { rows } = await pool.query(
      "INSERT INTO employees (name, email, status) VALUES ($1, $2, $3) RETURNING *",
      [name, email, status]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add employee" });
  }
});

// Update employee details
app.put("/employees/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, status } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE employees SET name = $1, email = $2, status = $3 WHERE id = $4 RETURNING *",
      [name, email, status, id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update employee" });
  }
});

// Delete employee
app.delete("/employees/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM employees WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

app.get("/employees", async (req, res) => {
  const { search, status } = req.query;
  try {
    let query = `SELECT * FROM employees WHERE 1=1`;
    let params = [];
    if (search) {
      query += ` AND (name ILIKE $1 OR email ILIKE $1)`;
      params.push(`%${search}%`);
    }
    if (status) {
      query += ` AND status = $2`;
      params.push(status);
    }

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});
app.get("/assets", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM assets");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching assets:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/assets", async (req, res) => {
  try {
    const { type, make, model, serialNumber } = req.body;
    console.log("Received data:", { type, make, model, serialNumber });
    await pool.query(
      "INSERT INTO assets (type, make, model, serialNumber) VALUES ($1, $2, $3, $4)",
      [type, make, model, serialNumber]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error("Error adding asset:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT /assets/:id - Update an existing asset
app.put("/assets/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { type, make, model, serialNumber } = req.body;
    await pool.query(
      "UPDATE assets SET type=$1, make=$2, model=$3, serialNumber=$4 WHERE id=$5",
      [type, make, model, serialNumber, id]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error("Error updating asset:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE /assets/:id - Delete an asset
app.delete("/assets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM assets WHERE id=$1", [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error deleting asset:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Other routes for login, registration, etc.
app.get("/", (req, res) => res.redirect("/login"));
app.get("/login", (req, res) => res.render("login"));
app.get("/about", (req, res) => res.render("about"));
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );
    if (result.rows.length > 0) {
      res.redirect("/about");
    } else {
      res.send("Invalid username or password.");
    }
  } catch (err) {
    console.error(err);
    res.send("Error during login.");
  }
});

// Render Asset Master Page
app.get("/assetMaster", (req, res) => {
  res.render("assetMaster");
});

//Ending of Asset Master Code

//Starting of categories code

// GET /categories - View categories
app.get("/categories", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories");
    const categories = result.rows || []; // Ensure categories is always an array, even if empty
    res.render("assetCategoryMaster", { categories: categories });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving categories");
  }
});

app.post("/categories", async (req, res) => {
  const { categoryName, categoryType, categoryDescription } = req.body;

  const query =
    "INSERT INTO categories (name, type, description) VALUES ($1, $2, $3)";
  try {
    await pool.query(query, [categoryName, categoryType, categoryDescription]);
    res.redirect("/categories");
  } catch (err) {
    console.error("Error inserting category:", err);
    res.status(500).send("Error adding category");
  }
});

// Update an existing category
app.post("/categories/update", async (req, res) => {
  const { id, categoryName, categoryType, categoryDescription } = req.body;

  const query =
    "UPDATE categories SET name = $1, type = $2, description = $3 WHERE id = $4";
  try {
    await pool.query(query, [
      categoryName,
      categoryType,
      categoryDescription,
      id,
    ]);
    res.redirect("/categories");
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).send("Error updating category");
  }
});

app.delete("/categories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING id",
      [id]
    );
    if (result.rowCount > 0) {
      res.status(200).send("Category deleted");
    } else {
      res.status(404).send("Category not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting category");
  }
});

//ending of categories code

// Route to render the asset form and display assets
app.get("/assetMaster", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM assets");

    console.log(result.rows);

    res.render("assetMaster", { assets: result.rows || [] });
  } catch (err) {
    console.error("Error fetching assets:", err);
    res.status(500).send("Error fetching assets");
  }
});

// POST route to handle form submission from `assetIssue.pug`
app.post("/submit", async (req, res) => {
  const { type, make, model } = req.body;

  try {
    await pool.query(
      "INSERT INTO assets (type, make, model) VALUES ($1, $2, $3)",
      [type, make, model]
    );
    const countResult = await pool.query(
      "SELECT type, COUNT(*) AS count FROM assets GROUP BY type"
    );

    const assetResult = await pool.query("SELECT * FROM assets");

    res.render("stockView", {
      assets: assetResult.rows,
      counts: countResult.rows,
    });
    res.render("assets");
  } catch (err) {
    console.error("Error submitting asset data:", err);
    res.status(500).send("Error submitting asset data");
  }
});

// DELETE route for deleting an asset
app.delete("/deleteAsset/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM assets WHERE id = $1", [id]);

    res.send("Asset deleted successfully!");
  } catch (err) {
    console.error("Error deleting asset:", err);
    res.status(500).send("Error deleting asset");
  }
});

app.get("/view", async (req, res) => {
  try {
    const countResult = await pool.query(
      "SELECT type, COUNT(*) AS count FROM assets GROUP BY type"
    );
    const assetResult = await pool.query("SELECT * FROM assets");
    res.render("stockView", {
      assets: assetResult.rows,
      counts: countResult.rows,
    });
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).send("Error fetching data");
  }
});

//stockview ending

app.locals.pool = pool;
app.use("/assets", assetRoutes);

//final part ending

// Start the server
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
