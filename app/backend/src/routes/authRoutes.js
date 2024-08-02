const express = require('express');
const { authUser, verifyUser, verifyPass } = require('../controllers/authController');

const router = express.Router();

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const auth = await authUser(email, password);
    if (auth.token) {
      res.status(200).json(auth);
    } else {
      res.status(401).json(auth);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Authenticate Route
router.get('/authenticate/:token', async (req, res) => {
  const { token } = req.params;

  // Input validation
  if (!token) {
    return res.status(400).json({ message: "Token is required." });
  }

  try {
    const auth = await verifyUser(token);
    if (auth) {
      res.status(200).json(auth);
    } else {
      res.status(401).json({ message: "Invalid token." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Change Password Route
router.post("/change", async (req, res) => {
  const { userId, oldPass, newPass } = req.body;

  // Input validation
  if (!userId || !oldPass || !newPass) {
    return res.status(400).json({ message: "User ID, old password, and new password are required." });
  }

  try {
    const result = await verifyPass(userId, oldPass, newPass);
    if (result.message === "Password updated successfully") {
      res.status(200).json(result);
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;