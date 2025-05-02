const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { usersLogger } = require("../utils/logger");

exports.register = async (req, res) => {
  try {
    const { username, password, role, email } = req.body;
    const user = new User({ username, password, role, email });
    await user.save();
    res.status(201).json({ message: "User registered." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isCorrectPassword = await user.comparePassword(password);
    if (!user || !isCorrectPassword)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
    usersLogger.error(err.message);
  }
};
