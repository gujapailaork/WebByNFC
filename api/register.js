import { Pool } from "pg";
import bcrypt from "bcrypt";

const pool = new Pool({
  connectionString: process.env.DATABASE_HOSTWEB,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false
    });
  }

  const { username, password } = req.body;

  try {

    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username.trim()]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(
      password.trim(),
      user.password
    );

    if (!validPassword) {
      return res.json({
        success: false,
        message: "Wrong password"
      });
    }

    return res.json({
      success: true
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}