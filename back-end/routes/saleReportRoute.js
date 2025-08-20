// routes/saleReportRoute.js
const express = require("express");
const router = express.Router();
const { getSalesReport } = require("../controllers/salesReport");

// GET rapport des ventes
router.get("/report", getSalesReport);

module.exports = router;
