const express = require("express");
const router = express.Router();
const parameterController = require("../controllers/parameterController");

// Get parameters
router.get("/", parameterController.getParameters);
// Set parameters (create or update)
router.post("/", parameterController.setParameters);

module.exports = router;
