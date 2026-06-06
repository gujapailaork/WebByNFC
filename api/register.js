import { Pool } from "pg";
import bcrypt from "bcrypt";

const pool = new Pool({
  connectionString: process.env.DATABASE_HOSTWEB,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  const { username, password } = req.body;

  try {

    const existing = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username.trim()]
    );

    if (existing.rows.length > 0) {
      return res.json({
        success: false,
        message: "Username already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(
      password.trim(),
      10
    );

    await pool.query(
      "INSERT INTO users(username,password) VALUES($1,$2)",
      [
        username.trim(),
        hashedPassword
      ]
    );

    return res.json({
      success: true,
      message: "Account created"
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}