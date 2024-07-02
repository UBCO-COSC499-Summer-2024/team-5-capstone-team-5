const express = require('express');
const router = express.Router();
const { addTest } = require('../controllers/testController');

router.post('/add', addTest);

module.exports = router;
