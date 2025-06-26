const express = require('express');
const router = express.Router();
const { getAllSales, createSale, getSaleById, updateSale,deleteSale } = require('../controllers/sales'); 


router.get('/getAllSales', getAllSales).post('/createSale', createSale);
router.get('/getSale/:id', getSaleById).put('/updateSale/:id', updateSale).delete('/deleteSale/:id', deleteSale);

module.exports = router;