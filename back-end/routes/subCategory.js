const express = require("express");
const router = express.Router();
const subCategoryController = require("../controllers/subCategoryController");

router.post("/", subCategoryController.createSubCategory);
router.get("/", subCategoryController.getSubCategories);

module.exports = router;
