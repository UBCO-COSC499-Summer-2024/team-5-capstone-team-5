const express = require('express');
const { authUser, verifyUser } = require('../controllers/authController');

const router = express.Router();

router.post("/login", async (req,res) => {
    const auth = await authUser(req.body.email, req.body.password);
    console.log(auth);
  });

  router.get('/authenticate/:token', async (req, res) => {
    const auth = await verifyUser(req.params.token);
    console.log(auth);
    res.json({message: auth});
  });

  module.exports = router;
