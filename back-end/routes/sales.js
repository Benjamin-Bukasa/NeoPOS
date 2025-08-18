const express = require('express');
const router = express.Router();

const { authenticateUser } = require('../middlwares/auth');
const requireRole = require('../middlwares/role');
const { getAllSales, createSale, getSaleById, updateSale, deleteSale, updateSaleItem } = require('../controllers/sales');
const { getSalesReport } = require('../controllers/salesReport');

// Rapport de ventes détaillé (tous rôles)
router.get('/report', authenticateUser, requireRole('ADMIN', 'MANAGER', 'SALER'), getSalesReport);
// ADMIN et MANAGER peuvent modifier un item de vente
router.put('/updateSaleItem/:id', authenticateUser, requireRole('ADMIN', 'MANAGER'), updateSaleItem);

// Tous les rôles (ADMIN, MANAGER, SALER) peuvent faire des ventes
router.post('/createSale', authenticateUser, requireRole('ADMIN', 'MANAGER', 'SALER'), createSale);

// ADMIN et MANAGER peuvent voir et gérer les ventes
router.get('/getAllSales', authenticateUser, requireRole('ADMIN', 'MANAGER', 'SALER'), getAllSales);
router.get('/getSale/:id', authenticateUser, requireRole('ADMIN', 'MANAGER'), getSaleById);
router.put('/updateSale/:id', authenticateUser, requireRole('ADMIN', 'MANAGER'), updateSale);
router.delete('/deleteSale/:id', authenticateUser, requireRole('ADMIN', 'MANAGER'), deleteSale);

module.exports = router;