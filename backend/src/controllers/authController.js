const bcrypt = require("bcrypt");
const db = require("../utils/db");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query =
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "Email already exists" });
        }
        return res.status(500).json({ message: "Database error" });
      }

      res.status(201).json({
        message: "User registered successfully",
        userId: result.insertId
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
