const express = require('express');
const { authUser, verifyUser } = require('../controllers/authController');

const router = express.Router();

router.post("/login", async (req,res) => {
    const { email, password } = req.body;
    try {
        const auth = await authUser(email, password);
        if(auth) {
            res.status(200).json(auth);
        } else {
            res.status(401).json({message : "Incorrect Credentials" });
        }
    } catch(error) {
        res.status(500).json({ message : "Internal Server Error" });
    }
  });

  router.get('/authenticate/:token', async (req, res) => {
    if(req.params.token == null) {
        res.status(404).json({ message: "Could not verify session. Token does not exist."});
    }
    const auth = await verifyUser(req.params.token);
    if(auth) {
        res.status(200).json(auth);
    } else {
        res.status(401).json({ message: "Could not verify session. Token is invalid." });
    }
  });

  module.exports = router;
