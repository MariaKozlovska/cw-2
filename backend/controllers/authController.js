const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const existing = await db.getAsync(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);

    await db.runAsync(
      "INSERT INTO users (name, email, passwordHash) VALUES (?, ?, ?)",
      [fullName, email, hash]
    );

    const newUser = await db.getAsync(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: newUser });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await db.getAsync(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!user)
      return res.status(400).json({ message: "User not found" });

    // Check password
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
      return res.status(400).json({ message: "Wrong password" });

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
