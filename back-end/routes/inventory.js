const express = require('express');
const router = express.Router();


const { createInventory, updateInventory, getInventory, deleteInventory, getCategoriesWithSubcategories, getAllInventories } = require('../controllers/inventoryController');

// Route pour obtenir tous les inventaires validés
router.get('/getAllInventories', getAllInventories);
// Route to get all categories with their subcategories
router.get('/categories-with-subcategories', getCategoriesWithSubcategories);


const { authenticateUser } = require('../middlwares/auth');
router.post('/createInventory', authenticateUser, createInventory);
router.put('/updateInventory/:id', updateInventory);
router.get('/getInventory', getInventory);
router.delete('/deleteInventory/:id', deleteInventory);

module.exports = router;