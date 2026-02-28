import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const { username, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username.trim()]
    );

    if (result.rows.length === 0) {
      return res.json({ success: false });
    }

    const user = result.rows[0];

    if (password.trim() === user.password.trim()) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }

  } catch (error) {
  console.error("LOGIN ERROR:", error);
  return res.status(500).json({
    success: false,
    message: error.message
  });
}
}