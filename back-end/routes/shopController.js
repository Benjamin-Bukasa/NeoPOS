// 📁 routes/shopRoutes.js
const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const { checkSubscriptionAccess } = require('../middlewares/subscription');

// Création d'une boutique avec son admin
router.post('/create', shopController.createShopWithAdmin);

// CRUD de la boutique
router.get('/', shopController.getAllShops);
router.get('/:id', shopController.getShopById);
router.put('/:id', shopController.updateShop);
router.delete('/:id', shopController.deleteShop);

// Abonnement
router.post('/:id/subscribe', shopController.subscribeShop);

// Middleware de vérification d'accès
router.use('/:id/protected-route', checkSubscriptionAccess, (req, res) => {
  res.status(200).json({ message: 'Accès autorisé à la boutique.' });
});

module.exports = router;
