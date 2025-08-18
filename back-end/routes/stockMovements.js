const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlwares/auth');
const requireRole = require('../middlwares/role');
const { createStockMovement } = require('../controllers/stockMovementController');

// ADMIN et MANAGER peuvent enregistrer un mouvement de stock
router.post('/', authenticateUser, requireRole('ADMIN', 'MANAGER'), createStockMovement);

module.exports = router;
