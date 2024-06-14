const express = require('express');
const { authUser } = require('../controllers/authController');

const router = express.Router();

router.post("/login", async (req,res) => {
    const auth = await authUser(req.body.email, req.body.password);
    console.log(auth);
  });

  module.exports = router;
