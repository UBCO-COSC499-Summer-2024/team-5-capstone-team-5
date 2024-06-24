const express = require('express');
const { authUser, verifyUser, verifyPass } = require('../controllers/authController');

const router = express.Router();

router.post("/login", async (req,res) => {
    const { email, password } = req.body;
    try {
        const auth = await authUser(email, password);   // Calls the authUser function in the authController file in authController.
        if(auth) {
            res.status(200).json(auth);     // Returns status code 200 (ok), also returns the auth variable as a json object.
        } else {
            res.status(401).json({message : "Incorrect Credentials" });     // Returns status code 401 (), also returns a message as a json object.
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

  router.post("/change", async (req, res) => {
    const {userId, oldPass, newPass} = req.body;
    try {
        await verifyPass(userId, oldPass, newPass);
        res.status(200).json({message: "Password updated."});
    } catch(error) {
        res.status(500).json({message: "Internal Server Error"});
    }
  })
    

  module.exports = router;
