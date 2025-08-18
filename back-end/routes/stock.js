const express = require('express');
const router = express.Router();

const { createStock, updateStock, getStocks, deleteStock } = require('../controllers/stockController');
const { authenticateUser } = require('../middlwares/auth');
const requireRole = require('../middlwares/role');

// Seuls ADMIN et MANAGER peuvent gérer les stocks
router.post('/createStock', authenticateUser, requireRole('ADMIN', 'MANAGER'), createStock);
router.put('/updateStock/:id', authenticateUser, requireRole('ADMIN', 'MANAGER'), updateStock);
router.get('/getStocks', authenticateUser, requireRole('ADMIN', 'MANAGER'), getStocks);
router.delete('/deleteStock/:id', authenticateUser, requireRole('ADMIN', 'MANAGER'), deleteStock);

module.exports = router;