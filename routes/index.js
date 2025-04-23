const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Hello from the server");
});

router.get("/login", (req, res) => {
  res.status(200).json({
    name: "test",
    age: 24,
  });
});

module.exports = router;
