const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

router.get("/dashboard", verifyToken, (req, res) => {
  res.json({
    success: true,
    message: `Welcome, ${req.user.username}! You have accessed a protected route.`
  });
});

module.exports = router;
