const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/salesStats');

router.get('/stats', getStats);

module.exports = router;
