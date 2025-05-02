const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId });
    res.status(200).json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
      new: true,
    });
    res.status(200).json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOneAndDelete({ _id: userId });
    res.status(200).json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
