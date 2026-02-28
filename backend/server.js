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

  console.log("====== LOGIN START ======");
  console.log("BODY:", req.body);

  try {
    // 🔍 ดู user ทั้งหมดใน DB ก่อน
    const allUsers = await pool.query("SELECT username, password FROM users");
    console.log("ALL USERS IN DB:", allUsers.rows);

    // 🔍 Query ตาม username ที่ส่งมา
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username.trim()]
    );

    console.log("QUERY RESULT:", result.rows);

    if (result.rows.length === 0) {
      console.log("❌ USER NOT FOUND");
      return res.json({ success: false });
    }

    const user = result.rows[0];

    console.log("COMPARE:");
    console.log("Input password:", `"${password}"`);
    console.log("DB password:", `"${user.password}"`);
    console.log("Length input:", password.length);
    console.log("Length DB:", user.password.length);

    if (password.trim() === user.password.trim()) {
      console.log("✅ LOGIN SUCCESS");
      return res.json({ success: true });
    } else {
      console.log("❌ PASSWORD NOT MATCH");
      return res.json({ success: false });
    }

  } catch (err) {
    console.log("🔥 ERROR:", err);
    return res.status(500).json({ success: false });
  }
});