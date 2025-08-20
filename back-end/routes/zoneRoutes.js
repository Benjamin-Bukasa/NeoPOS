// routes/zoneRoutes.js
const express = require('express');
const router = express.Router();
const { getZones, createZone } = require('../controllers/zoneController');

// GET toutes les zones
router.get('/', getZones);

// POST création d'une zone

router.post('/', createZone);

module.exports = router;
