const express = require('express');
const router = express.Router();

const { getLogReport } = require('../controllers/logReport');
const { authenticateUser } = require('../middlwares/auth');
const requireRole = require('../middlwares/role');

// Rapport de logs (ADMIN, MANAGER, SALER)
router.get('/report', authenticateUser, requireRole('ADMIN', 'MANAGER', 'SALER'), getLogReport);

module.exports = router;
