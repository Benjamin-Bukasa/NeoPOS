const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");

// ➕ CREATE
router.post("/", supplierController.createSupplier);

// 📋 READ ALL
router.get("/", supplierController.getSuppliers);

// 🔎 READ ONE
router.get("/:id", supplierController.getSupplierById);

// ✏️ UPDATE
router.put("/:id", supplierController.updateSupplier);

// ❌ DELETE
router.delete("/:id", supplierController.deleteSupplier);

module.exports = router;
