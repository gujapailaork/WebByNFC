const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// เชื่อม PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});



// LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  console.log("BODY:", req.body);   // 👈 เพิ่มบรรทัดนี้

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username.trim()]
    );

    console.log("DB result:", result.rows);  // 👈 เพิ่ม

    if (result.rows.length === 0) {
      return res.json({ success: false });
    }

    const user = result.rows[0];

    console.log("Compare:", password, user.password); // 👈 เพิ่ม

    if (password.trim() === user.password.trim()) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }

  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({ success: false });
  }
});






app.listen(3000, () => {
  console.log("Server running on port 3000");
});


pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.log("Database error:", err);
  } else {
    console.log("Connected to PostgreSQL:", res.rows);
  }
});
